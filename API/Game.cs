﻿using System.Collections;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using RRH_Minigames_API.Identity;

namespace RRH_Minigames_API;

public static class GameManager
{
    public static List<Game> PlayingGames { get; set; } = new();
    public static List<QueueingMember> QueueingPlayers { get; set; } = new List<QueueingMember>();    
    
    public static bool Queue(DbUser user, AvailableGames game , DataContext ctx, out Game? gameStarted)
    {
        gameStarted = null;
        foreach (var queueingPlayer in QueueingPlayers)
        {
            if(queueingPlayer.User.GUID == user.GUID) return false;
        }
        var sameGameQueuers = QueueingPlayers.Find(u => u.Game == game);
        if(sameGameQueuers != null)
        {
            gameStarted = StartGame(user, sameGameQueuers!.User, game, ctx);
            QueueingPlayers.Remove(sameGameQueuers);
            return true;
        }
        QueueingPlayers.Add(new QueueingMember(user, game));
        return true;
    }
    public static Game StartGame(DbUser player1, DbUser player2, AvailableGames game, DataContext ctx)
    {
        var newGame = new Game(game, player1.GUID, player2.GUID, ctx);
        PlayingGames.Add(newGame);
        return newGame;
    }
    
    public static DbUser? EndGame(Game game, DataContext ctx)
    {
        PlayingGames.Remove(game);
        var winner = ctx.Users.FirstOrDefault(u => u.GUID == game.WinnerGuid);
        return winner;
    }
    
}
public class Game
{
    public Game(AvailableGames gameName, string player1Guid, string player2Guid, DataContext ctx)
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
    public SoloGame(AvailableGames gameName, string player1Guid, DataContext ctx) 
    : base(gameName, player1Guid, player1Guid, ctx)
    {
    }

    public override string? Player2Guid => null;
}