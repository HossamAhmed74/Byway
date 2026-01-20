using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace MyApp.Application.Dtos
{
    public class FacebookLoginDto
    {
        public string AccessToken { get; set; } = string.Empty;
        public string UserID { get; set; } = string.Empty;
    }
    public class FacebookDebugTokenResponse
    {
        [JsonPropertyName("data")]
        public TokenData Data { get; set; }
    }

    public class TokenData
    {
        [JsonPropertyName("app_id")]
        public string AppId { get; set; } = string.Empty;

        [JsonPropertyName("user_id")]
        public string UserId { get; set; } = string.Empty;

        [JsonPropertyName("is_valid")]
        public bool IsValid { get; set; } = false;


        [JsonPropertyName("type")]
        public string Type { get; set; } = string.Empty;

        [JsonPropertyName("application")]
        public string Application { get; set; } = string.Empty;

        [JsonPropertyName("data_access_expires_at")]
        public long DataAccessExpiresAt { get; set; }

        [JsonPropertyName("expires_at")]
        public long ExpiresAt { get; set; }

        [JsonPropertyName("scopes")]
        public List<string>? Scopes { get; set; }
    }

    public class FacebookUserData
    {
        [JsonPropertyName("id")]
        public string Id { get; set; } = string.Empty;
        [JsonPropertyName("name")]
        public string Name { get; set; } = string.Empty;
        [JsonPropertyName("email")]
        public string Email { get; set; } = string.Empty;
    }
}
