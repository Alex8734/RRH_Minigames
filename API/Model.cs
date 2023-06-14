using System.Runtime.CompilerServices;
using System.Text.Json.Serialization;
using RRH_Minigames_API.Identity;

namespace RRH_Minigames_API;

public enum AvailableGames
{
    Chess,
    TicTacToe,
    SpaceShooter,
    CarRacing,
    FlappyBird,
    Minesweeper,
    Snake
}

public class PlayerStat
{
    [JsonIgnore]
    public DbUser User {get; set;} = default!;
    [JsonIgnore]
    public int Id { get; set; }
    [JsonIgnore]
    public string Guid { get; set; } = default!;
    public AvailableGames Game { get; set; } = default!;
    public int HighScore { get; set; }
    public int PlayCount { get; set; }
    
}

public record NewStat(AvailableGames Game, int Score);

public record QueueingMember(DbUser User, AvailableGames Game);

public class DbUser
{
 
    public string UserName { get; set; } = default!;
    public string Password { get; set; } = default!;
    public string? Email { get; set; } = default!;
    public string GUID { get; set; } = default!;
    public List<PlayerStat> Stats { get; set; } = default!;
    //public List<string> PlayedGames { get; set; } = default!;
}

public class StringOutput
{
    public StringOutput(string value)
    {
        Value = value;
    }
    public string Value { get; set; } = default!;
}   

public class NewUser
{
    public string UserName { get; set; } = default!;
    public string Password { get; set; } = default!;
    public string? Email { get; set; } = default!;
}

public record GetMoveData(string gameId, string move);
public record GetPlayerData();

