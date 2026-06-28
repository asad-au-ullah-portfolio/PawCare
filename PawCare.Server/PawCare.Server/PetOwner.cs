namespace PawCare.Server;

public class PetOwner
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;

    /// <summary>
    /// Navigation property: One owner can have many pets
    /// </summary>
    public List<Pet> Pets { get; set; } = new();
}
