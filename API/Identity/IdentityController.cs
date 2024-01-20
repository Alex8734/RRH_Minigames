using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.JsonWebTokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text.Json;
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
    [HttpPost("RegisterAnonymous")]
    public IActionResult RegisterAnonym()
    {
        var user = new AnonymousUser();
        var dbUser = new DbUser
        {
            Email = user.Email,
            GUID = user.GUID,
            Password = user.Password,
            Stats = user.Stats,
            UserName = user.UserName
        };
        var token =GenerateToken(dbUser);
        return Ok(JsonSerializer.Serialize(new
        {
            Token = token,
            UserName = user.UserName
        }));
    }
    
    [HttpPost("Register")]
    public IActionResult RegisterUser([FromBody] NewUser newUser)
    {
        if(!IsNewUserValid(newUser))
        {
            return BadRequest(new JsonOutput<string>("User already exists"));
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
        
        if(user.Email == null) return BadRequest(new JsonOutput<string>("Invalid email"));
        if(user.UserName == "") return BadRequest(new JsonOutput<string>("Invalid username"));
        if(user.Password == "") return BadRequest(new JsonOutput<string>("Invalid password"));
        _context.Users.Add(dbUser);
        _context.SaveChanges();

        return Login(new LoginUser()
        {
            Identity = newUser.UserName,
            Password = newUser.Password
        });
    }

    private bool IsNewUserValid(NewUser newUser)
        => _context.Users
            .Where(u => u.Email == newUser.Email || u.UserName == newUser.UserName)
            .ToList().Count == 0;
    
    [HttpPost("Login")]
    public IActionResult Login([FromBody] LoginUser loginUser)
    {
        var user = _context.Users.FirstOrDefault(u => u.Email == loginUser.Identity || u.UserName == loginUser.Identity);
        if(user == null || user!.Password != loginUser.Password)
        {
            return Unauthorized(new JsonOutput<string>("login incorrect"));
        }
        var token = GenerateToken(user);

        return Ok(JsonSerializer.Serialize(new
        {
            Token = token,
            UserName = user.UserName
        }));
    }

    private string GenerateToken( DbUser loginUser)
    {
        var user = new User(loginUser.UserName, loginUser.Password, loginUser.Email, loginUser.GUID);
        
        var tokenDescriptor = new SecurityTokenDescriptor()
        {
            Subject = new ClaimsIdentity(new Claim[]
            {
                new(JwtRegisteredClaimNames.Name, user.UserName),
                new(JwtRegisteredClaimNames.Email, user.Email ?? ""),
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
    public static string? GetUserNameFromToken(HttpContext httpContext)
    {
        var identity = httpContext.User.Identity as ClaimsIdentity;
        if (identity == null) return null;
        var claim = identity.Claims.ToList().Find(c => c.Type == "name");
        
        if(claim == null) return null;
        return claim.Value;
    }
}