using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.JsonWebTokens;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authentication;
using Microsoft.IdentityModel.Tokens;
using JwtRegisteredClaimNames = Microsoft.IdentityModel.JsonWebTokens.JwtRegisteredClaimNames;

namespace RRH_Minigames_API.Identity;

[Route("User")]
[ApiController]
public class IdentityController : ControllerBase
{
    private const string TokenSecret = "sjkhwlakejh2kljh23kjh4kjndsakjfkjh43kjh";
    private static readonly TimeSpan TokenLifetime = TimeSpan.FromHours(8);
    
    private readonly DataContext _context;
    private readonly JwtSecurityTokenHandler _tokenHandler;
    
    public IdentityController(DataContext context)
    {
        _context = context;
        _tokenHandler = new JwtSecurityTokenHandler();
    }

    [HttpPost("Register")]
    public IActionResult RegisterUser([FromBody] NewUser newUser)
    {
        if(!IsNewUserValid(newUser))
        {
            return BadRequest("User already exists");
        }
        var user = new User(
            newUser.UserName,
            newUser.Password,
            newUser.Email
        );
        var dbUser = new DbUser()
        {
            Email = user.Email,
            GUID = user.GUID,
            Password = user.Password,
            Stats = user.Stats,
            UserName = user.UserName
        };
        
        if(user.Email == null) return BadRequest("Invalid email");
        _context.Users.Add(dbUser);
        _context.SaveChanges();

        return LoginUser(newUser);
    }

    private bool IsNewUserValid(NewUser newUser)
        => _context.Users
            .Where(u => u.Email == newUser.Email || u.UserName == newUser.UserName)
            .ToList().Count == 0;
    
    [HttpPost("Login")]
    public IActionResult LoginUser([FromBody] NewUser newUser)
    {
        var user = _context.Users.FirstOrDefault(u => u.Email == newUser.Email);
        if(user!.Password != newUser.Password || user.UserName != newUser.UserName)
        {
            return Unauthorized("Login incorrect");
        }
        var token = GenerateToken(user);
        
        return Ok(new JsonOutput<string>(token));
    }

    private string GenerateToken( DbUser loginUser)
    {
        var user = new User(loginUser.UserName, loginUser.Password, loginUser.Email, loginUser.GUID);
        if(user.Email == null) return "";
        
        var tokenDescriptor = new SecurityTokenDescriptor()
        {
            Subject = new ClaimsIdentity(new Claim[]
            {
                new(JwtRegisteredClaimNames.Name, user.UserName),
                new(JwtRegisteredClaimNames.Email, user.Email),
                new(JwtRegisteredClaimNames.NameId, user.GUID)
            }),
            Expires = DateTime.UtcNow.Add( TokenLifetime),
            Issuer = "http://localhost:5000",
            Audience = "http://localhost:5000",
            SigningCredentials = new SigningCredentials
            (
                new SymmetricSecurityKey(Encoding.UTF8.GetBytes(TokenSecret)),
                SecurityAlgorithms.HmacSha256Signature
            )
        };
        
        var token = _tokenHandler.CreateToken(tokenDescriptor);
        return _tokenHandler.WriteToken(token);
    }
    
    public static string? GetGuidFromToken(HttpContext httpContext)
    {
        var identity = httpContext.User.Identity as ClaimsIdentity;
        if (identity == null) return null;
        var claim = identity.Claims.ToList().Find(c => c.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier");
        
        if(claim == null) return null;
        return claim.Value;
    }
}