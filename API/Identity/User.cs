using System.Text.RegularExpressions;

namespace RRH_Minigames_API.Identity;

public class User
{
    public User(string userName, string password, string? email = null, string? guid = null)
    { 
        if(email != null && Regex.IsMatch(email,@"^[\w*\.]+@([\w-]+\.)+[\w-]{2,4}$"))
        {
            Email = email;
        }
        UserName = userName;
        Password = password;
        GUID = guid ?? Guid.NewGuid().ToString() ;
    }
    public string UserName { get; set; }
    public string Password { get; set; }
    public string? Email { get; set; }
    public string GUID { get; set; }
    public List<PlayerStat> Stats { get; set; } = new();
    public List<string> PlayedGames { get; set; } = new();
}
public class AnonymousUser : User
{
    public AnonymousUser(string? guid = null) : base("Anonymous", "Anonymous", guid: guid)
    {
    }
}