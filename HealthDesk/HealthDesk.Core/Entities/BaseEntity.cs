using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace HealthDesk.Core;

 public class BaseEntity
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public DateTime CreateDate { get; set; }
        public string CreateUser { get; set; }
    }