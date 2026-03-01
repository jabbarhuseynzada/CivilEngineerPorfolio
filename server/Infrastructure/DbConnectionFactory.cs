using Microsoft.Extensions.Options;
using Npgsql;
using TikintiApi.Entities;

namespace TikintiApi.Infrastructure;

public class DbConnectionFactory(IOptions<DatabaseSettings> settings)
{
    private readonly string _connectionString = settings.Value.ConnectionString;

    public NpgsqlConnection Create() => new(_connectionString);
}
