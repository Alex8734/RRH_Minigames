using System.Collections;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using RRH_Minigames_API.Controllers;
using RRH_Minigames_API.Identity;

namespace RRH_Minigames_API;

public static class GameManager
{
    public static List<SoloGame> PlayingSoloGames { get; set; } = new();
    public static List<Game> PlayingGames { get; set; } = new();
    public static List<QueueingMember> QueueingPlayers { get; set; } = new List<QueueingMember>();    
    
    public static bool Queue(DbUser user, AvailableGames game , DataContext ctx, out Game? gameStarted)
    {
        gameStarted = null;
        if (QueueingPlayers.Any(queueingPlayer => queueingPlayer.User.GUID == user.GUID))
        {
            return false;
        }
        var sameGameQueuers = QueueingPlayers.Find(u => u.Game == game);
        if(sameGameQueuers != null)
        {
            gameStarted = StartGame(user, sameGameQueuers!.User, game);
            QueueingPlayers.RemoveAt(QueueingPlayers.FindIndex(u => u.Game == game));
            return true;
        }
        QueueingPlayers.Add(new QueueingMember(user, game));
        return true;
    }
    public static bool Dequeue(DbUser user, AvailableGames game)
    {
        var queueingPlayer = QueueingPlayers.FirstOrDefault(u => u.User.GUID == user.GUID && u.Game == game);
        if(queueingPlayer == null) return false;
        QueueingPlayers.Remove(queueingPlayer);
        return true;
    }
    public static Game StartGame(DbUser player1, DbUser player2, AvailableGames game)
    {
        var newGame = new Game(game, player1.GUID, player2.GUID);
        PlayingGames.Add(newGame);
        return newGame;
    }
    public static Game StartSoloGame(DbUser player, AvailableGames game)
    {
        var newGame = new SoloGame(game, player.GUID);
        PlayingSoloGames.Add(newGame);
        return newGame;
    }
    public static string GetGameId(string userGuid)
    {
        var game = PlayingGames.Find(g => g.Player1Guid == userGuid || g.Player2Guid == userGuid);
        return game?.GameId ?? "";
    }
    
    public static bool EndGame(Game game, DataContext ctx)
    {
        PlayingGames.Remove(game);
        if(game.WinnerGuid == "")
        {
            GameStatController.UpdatePlayerStat(new NewStat(game.GameName, -1), game.Player1Guid, ctx);
            GameStatController.UpdatePlayerStat(new NewStat(game.GameName, -1), game.Player2Guid!, ctx);
            return true;
        }
        if(game.WinnerGuid == null)
        {
            return false;
        }
        var winner = ctx.Users.FirstOrDefault(u => u.GUID == game.WinnerGuid);
        GameStatController.UpdatePlayerStat(new NewStat(game.GameName, 2), game.WinnerGuid, ctx);
        GameStatController.UpdatePlayerStat(new NewStat(game.GameName, -1), game.Player1Guid, ctx);
        if(winner == null) return false;
        foreach (var playingGame in PlayingGames)
        {
            Console.WriteLine(playingGame.GameName);
        }
        return true;
    }
    
}
public class Game
{
    public Game(AvailableGames gameName, string player1Guid, string player2Guid)
    {
        Player1Guid = player1Guid;
        Player2Guid = player2Guid;
        GameId = Guid.NewGuid().ToString();
        GameName = gameName;  
    }
    public List<Move> Moves { get; set; } = new();
    public int Score { get; set; }
    public AvailableGames GameName { get; init; }
    public string GameId { get; }
    public string Player1Guid { get; init; }
    public string? WinnerGuid { get; set; }
    public virtual string? Player2Guid { get; init; }
}

public class Move
{
    [JsonIgnore]
    public int Id { get; set; }
    [JsonIgnore]
    public Game Game { get; set; } = default!;
    [JsonIgnore]
    public string GameId { get; set; } = default!;
    public string MoveString { get; set; } = default!;
    
}

public class SoloGame : Game
{
    public SoloGame(AvailableGames gameName, string player1Guid) 
    : base(gameName, player1Guid, player1Guid)
    {
    }

    public override string? Player2Guid => null;
}