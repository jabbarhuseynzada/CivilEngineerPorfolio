using System.Text;
using System.Text.Json;
using Dapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Npgsql;
using TikintiApi.Infrastructure;
using TikintiApi.Entities;
using TikintiApi.Repositories;
using TikintiApi.Repositories.Interfaces;
using TikintiApi.Services;

// Dapper: automatically map snake_case columns → PascalCase properties
DefaultTypeMap.MatchNamesWithUnderscores = true;

var builder = WebApplication.CreateBuilder(args);

// ── Settings ────────────────────────────────────────────────────────────────
builder.Services.Configure<DatabaseSettings>(o =>
    o.ConnectionString = builder.Configuration.GetConnectionString("DefaultConnection")!);
builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("Jwt"));

// ── Infrastructure ───────────────────────────────────────────────────────────
builder.Services.AddSingleton<DbConnectionFactory>();

// ── Repositories ─────────────────────────────────────────────────────────────
builder.Services.AddSingleton<IAdminUserRepository,      AdminUserRepository>();
builder.Services.AddSingleton<IServiceRepository,        ServiceRepository>();
builder.Services.AddSingleton<IProjectRepository,        ProjectRepository>();
builder.Services.AddSingleton<IContactMessageRepository, ContactMessageRepository>();
builder.Services.AddSingleton<ISiteSettingsRepository,   SiteSettingsRepository>();

// ── Services ─────────────────────────────────────────────────────────────────
builder.Services.AddSingleton<AuthService>();
builder.Services.AddSingleton<ServicesService>();
builder.Services.AddSingleton<ProjectsService>();
builder.Services.AddSingleton<ContactMessagesService>();
builder.Services.AddSingleton<SiteSettingsService>();

// ── Controllers & OpenAPI ────────────────────────────────────────────────────
builder.Services.AddControllers();
builder.Services.AddOpenApi();

// ── CORS ─────────────────────────────────────────────────────────────────────
var allowedOriginsRaw = builder.Configuration["ALLOWED_ORIGINS"] ?? "";
var allowedOrigins = allowedOriginsRaw.Length > 0
    ? allowedOriginsRaw.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
    : builder.Configuration.GetSection("AllowedOrigins").Get<string[]>() ?? [];
builder.Services.AddCors(o => o.AddPolicy("ReactApp", p =>
    p.WithOrigins(allowedOrigins).AllowAnyHeader().AllowAnyMethod()));

// ── JWT Authentication ───────────────────────────────────────────────────────
var jwtSettings = builder.Configuration.GetSection("Jwt").Get<JwtSettings>()!;
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(o => o.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer           = true,
        ValidateAudience         = true,
        ValidateLifetime         = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer              = jwtSettings.Issuer,
        ValidAudience            = jwtSettings.Audience,
        IssuerSigningKey         = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.Secret))
    });
builder.Services.AddAuthorization();

// ── Ensure wwwroot exists for static file serving ────────────────────────────
var webRootPath = Path.Combine(builder.Environment.ContentRootPath, "wwwroot");
Directory.CreateDirectory(webRootPath);
builder.WebHost.UseWebRoot(webRootPath);

// ── Build ────────────────────────────────────────────────────────────────────
var app = builder.Build();

await InitializeDatabaseAsync(app);

if (app.Environment.IsDevelopment())
    app.MapOpenApi();

app.UseCors("ReactApp");
app.UseStaticFiles();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();

// ── Database initialization & seeding ────────────────────────────────────────
static async Task InitializeDatabaseAsync(WebApplication app)
{
    var connStr  = app.Configuration.GetConnectionString("DefaultConnection")!;
    var jsonOpts = new JsonSerializerOptions(JsonSerializerDefaults.Web);

    // Retry until PostgreSQL is ready (important in Docker)
    for (var attempt = 1; attempt <= 15; attempt++)
    {
        try
        {
            await using var conn = new NpgsqlConnection(connStr);
            await conn.OpenAsync();

            // ── Create tables ────────────────────────────────────────────────
            await conn.ExecuteAsync("""
                CREATE TABLE IF NOT EXISTS admin_users (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    username TEXT NOT NULL UNIQUE,
                    password_hash TEXT NOT NULL
                );

                CREATE TABLE IF NOT EXISTS services (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    title TEXT NOT NULL,
                    description TEXT NOT NULL DEFAULT '',
                    image_url TEXT NOT NULL DEFAULT '',
                    "order" INTEGER NOT NULL DEFAULT 0,
                    is_active BOOLEAN NOT NULL DEFAULT TRUE
                );

                CREATE TABLE IF NOT EXISTS projects (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    title TEXT NOT NULL,
                    category TEXT NOT NULL DEFAULT '',
                    location TEXT NOT NULL DEFAULT '',
                    date TEXT NOT NULL DEFAULT '',
                    area TEXT NOT NULL DEFAULT '',
                    description TEXT NOT NULL DEFAULT '',
                    image_url TEXT NOT NULL DEFAULT ''
                );

                CREATE TABLE IF NOT EXISTS contact_messages (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    name TEXT NOT NULL,
                    phone TEXT NOT NULL DEFAULT '',
                    email TEXT NOT NULL DEFAULT '',
                    service TEXT NOT NULL DEFAULT '',
                    message TEXT NOT NULL DEFAULT '',
                    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                    is_read BOOLEAN NOT NULL DEFAULT FALSE
                );

                CREATE TABLE IF NOT EXISTS site_settings (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    company_name TEXT NOT NULL DEFAULT '',
                    company_description TEXT NOT NULL DEFAULT '',
                    about_text1 TEXT NOT NULL DEFAULT '',
                    about_text2 TEXT NOT NULL DEFAULT '',
                    stats JSONB NOT NULL DEFAULT '[]',
                    achievements JSONB NOT NULL DEFAULT '[]',
                    contact_info JSONB NOT NULL DEFAULT '{}',
                    working_hours JSONB NOT NULL DEFAULT '[]',
                    social_links JSONB NOT NULL DEFAULT '[]',
                    core_values JSONB NOT NULL DEFAULT '[]'
                );
                """);

            // ── Migrate: add new site_settings columns for existing DBs ─────
            await conn.ExecuteAsync("""
                ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS hero_title TEXT NOT NULL DEFAULT 'Evinizi Xəyallarınızdan Həqiqətə Çeviririk';
                ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS hero_subtitle TEXT NOT NULL DEFAULT '20 illik təcrübə ilə tam tikinti, təmir, elektrik işləri və daha çoxunu peşəkar keyfiyyətdə təqdim edirik.';
                ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS hero_tagline TEXT NOT NULL DEFAULT 'Peşəkar Tikinti Xidmətləri';
                ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS hero_images JSONB NOT NULL DEFAULT '[]';
                ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS about_heading TEXT NOT NULL DEFAULT 'Sizin Xəyallarınızı Həyata Keçiririk';
                ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS about_images JSONB NOT NULL DEFAULT '[]';
                """);

            // ── Seed admin ───────────────────────────────────────────────────
            var companyName   = app.Configuration["App:CompanyName"] ?? "";
            var adminUsername = app.Configuration["Admin:Username"] ?? "admin";
            var adminPassword = app.Configuration["Admin:Password"] ?? "admin123";
            var adminCount = await conn.ExecuteScalarAsync<long>("SELECT COUNT(*) FROM admin_users");
            if (adminCount == 0)
                await conn.ExecuteAsync(
                    "INSERT INTO admin_users (username, password_hash) VALUES (@u, @h)",
                    new { u = adminUsername, h = BCrypt.Net.BCrypt.HashPassword(adminPassword) });

            // ── Seed services ────────────────────────────────────────────────
            var svcCount = await conn.ExecuteScalarAsync<long>("SELECT COUNT(*) FROM services");
            if (svcCount == 0)
            {
                var seedServices = new[]
                {
                    new { Title = "Tam Ev Tikintisi",   Description = "Fundamentdən damına qədər tam ev tikintisi. Peşəkar layihələndirmə və icraat.",  ImageUrl = "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80", Order = 1 },
                    new { Title = "Elektrik İşləri",    Description = "Tam elektrik quraşdırılması və təmiri. Sertifikatlı elektrik mühəndisi.",        ImageUrl = "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80", Order = 2 },
                    new { Title = "Ev Təmiri",          Description = "Hər növ ev təmiri və yenilənməsi. Keyfiyyət və operativlik zəmanəti.",           ImageUrl = "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=800&q=80", Order = 3 },
                    new { Title = "Rəngləmə İşləri",   Description = "Professional rəngləmə və dekorativ tamamlama işləri.",                           ImageUrl = "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80", Order = 4 },
                    new { Title = "Təmir və Yenilənmə", Description = "Köhnə binaların təmiri və müasir standartlara uyğunlaşdırılması.",               ImageUrl = "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80", Order = 5 },
                    new { Title = "Layihələndirmə",     Description = "3D vizuallaşdırma və peşəkar memarlıq layihələri.",                              ImageUrl = "https://images.unsplash.com/photo-1503387837-b154d5074bd2?w=800&q=80", Order = 6 },
                };
                foreach (var s in seedServices)
                    await conn.ExecuteAsync(
                        """INSERT INTO services (title, description, image_url, "order") VALUES (@Title, @Description, @ImageUrl, @Order)""", s);
            }

            // ── Seed projects ────────────────────────────────────────────────
            var projCount = await conn.ExecuteScalarAsync<long>("SELECT COUNT(*) FROM projects");
            if (projCount == 0)
            {
                var seedProjects = new[]
                {
                    new { Title = "İki Mərtəbəli Villa",  Category = "ev",       Location = "Bakı, Binəqədi",   Date = "2024", Area = "250 m²", Description = "Müasir dizaynlı iki mərtəbəli villa tikintisi.", ImageUrl = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80" },
                    new { Title = "Mənzil Təmiri",        Category = "temir",    Location = "Bakı, Nəsimi",     Date = "2024", Area = "120 m²", Description = "Tam daxili təmir və müasir dizayn.",             ImageUrl = "https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=800&q=80" },
                    new { Title = "Bağ Evi Tikintisi",    Category = "ev",       Location = "Mərdəkan",         Date = "2023", Area = "180 m²", Description = "Dəniz kənarında rahat bağ evi.",                 ImageUrl = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80" },
                    new { Title = "Elektrik Sistemləri",  Category = "elektrik", Location = "Bakı, Yasamal",    Date = "2024", Area = "150 m²", Description = "Tam elektrik sisteminin yenilənməsi.",           ImageUrl = "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&q=80" },
                    new { Title = "Ofis Təmiri",          Category = "temir",    Location = "Bakı, Nərimanov",  Date = "2023", Area = "200 m²", Description = "Müasir ofis məkanının dizaynı.",                 ImageUrl = "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80" },
                    new { Title = "Üç Mərtəbəli Ev",      Category = "ev",       Location = "Sumqayıt",         Date = "2023", Area = "320 m²", Description = "Ağıllı ev sistemi ilə villa.",                   ImageUrl = "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80" },
                };
                foreach (var p in seedProjects)
                    await conn.ExecuteAsync(
                        "INSERT INTO projects (title, category, location, date, area, description, image_url) VALUES (@Title, @Category, @Location, @Date, @Area, @Description, @ImageUrl)", p);
            }

            // ── Seed site settings ───────────────────────────────────────────
            var settingsCount = await conn.ExecuteScalarAsync<long>("SELECT COUNT(*) FROM site_settings");
            if (settingsCount == 0)
            {
                var stats        = JsonSerializer.Serialize(new[] { new { Value = "20+", Label = "İl Təcrübə" }, new { Value = "500+", Label = "Layihə" }, new { Value = "100%", Label = "Məmnuniyyət" } }, jsonOpts);
                var achievements = JsonSerializer.Serialize(new[] { new { Number = "20+", Label = "İllik Təcrübə", Icon = "FaAward" }, new { Number = "500+", Label = "Məmnun Müştəri", Icon = "FaUsers" }, new { Number = "100%", Label = "Keyfiyyət Zəmanəti", Icon = "FaCheckCircle" }, new { Number = "15+", Label = "Sertifikat", Icon = "FaCertificate" } }, jsonOpts);
                var contactInfo  = JsonSerializer.Serialize(new { Phone = "+994 XX XXX XX XX", WhatsApp = "+994 XX XXX XX XX", Email = "info@tikinti.az", Address = "Bakı, Azərbaycan" }, jsonOpts);
                var workingHours = JsonSerializer.Serialize(new[] { new { Days = "Bazar ertəsi - Cümə", Hours = "09:00 - 18:00", IsWorkingDay = true }, new { Days = "Şənbə", Hours = "10:00 - 15:00", IsWorkingDay = true }, new { Days = "Bazar", Hours = "Qeyri-iş günü", IsWorkingDay = false } }, jsonOpts);
                var socialLinks  = JsonSerializer.Serialize(new[] { new { Platform = "WhatsApp", Url = "https://wa.me/994XXXXXXXXX" }, new { Platform = "Telegram", Url = "https://t.me/username" }, new { Platform = "Instagram", Url = "https://instagram.com/username" } }, jsonOpts);
                var coreValues   = JsonSerializer.Serialize(new[] { "Keyfiyyət", "Etibarlılıq", "Şəffaflıq", "İnnovasiya" }, jsonOpts);
                var heroImages   = JsonSerializer.Serialize(new[] { "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80", "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&q=80" }, jsonOpts);
                var aboutImages  = JsonSerializer.Serialize(new[] { "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80", "https://images.unsplash.com/photo-1590496793907-3b0bc5ffd160?w=800&q=80", "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&q=80" }, jsonOpts);

                await conn.ExecuteAsync(
                    """
                    INSERT INTO site_settings
                        (company_name, company_description, about_text1, about_text2,
                         stats, achievements, contact_info, working_hours, social_links, core_values,
                         hero_title, hero_subtitle, hero_tagline, hero_images, about_heading, about_images)
                    VALUES
                        (@CompanyName, @CompanyDescription, @AboutText1, @AboutText2,
                         @Stats::jsonb, @Achievements::jsonb, @ContactInfo::jsonb,
                         @WorkingHours::jsonb, @SocialLinks::jsonb, @CoreValues::jsonb,
                         @HeroTitle, @HeroSubtitle, @HeroTagline, @HeroImages::jsonb,
                         @AboutHeading, @AboutImages::jsonb)
                    """,
                    new
                    {
                        CompanyName        = companyName,
                        CompanyDescription = "20 illik təcrübə ilə Azərbaycanda ən keyfiyyətli tikinti xidmətləri. Sizin etibar etdiyiniz usta.",
                        AboutText1         = "Mən tikinti mühəndisi olaraq 20 ildən artıqdır ki, Azərbaycanda yüzlərlə layihəni uğurla həyata keçirmişəm. Ev tikintisindən tutmuş böyük miqyaslı təmir işlərinə qədər hər bir layihəyə peşəkarlıqla yanaşıram.",
                        AboutText2         = "Müasir texnologiyalar və ən yaxşı materiallardan istifadə edərək, hər bir müştəriyə fərdi yanaşma və maksimum keyfiyyət təmin edirəm. Mənim əsas məqsədim - müştərilərin tam məmnuniyyətidir.",
                        Stats              = stats,
                        Achievements       = achievements,
                        ContactInfo        = contactInfo,
                        WorkingHours       = workingHours,
                        SocialLinks        = socialLinks,
                        CoreValues         = coreValues,
                        HeroTitle          = "Evinizi Xəyallarınızdan Həqiqətə Çeviririk",
                        HeroSubtitle       = "20 illik təcrübə ilə tam tikinti, təmir, elektrik işləri və daha çoxunu peşəkar keyfiyyətdə təqdim edirik.",
                        HeroTagline        = "Peşəkar Tikinti Xidmətləri",
                        HeroImages         = heroImages,
                        AboutHeading       = "Sizin Xəyallarınızı Həyata Keçiririk",
                        AboutImages        = aboutImages,
                    });
            }

            app.Logger.LogInformation("Database initialized successfully.");
            return;
        }
        catch (Exception ex) when (attempt < 15)
        {
            app.Logger.LogWarning("DB not ready (attempt {Attempt}/15): {Message}. Retrying in 2s…", attempt, ex.Message);
            await Task.Delay(2000);
        }
    }

    throw new Exception("Could not connect to PostgreSQL after 15 attempts.");
}
