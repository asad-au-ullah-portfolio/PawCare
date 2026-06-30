namespace PawCare.Server.Features.Pets;

public interface IPetService
{
    Task<IReadOnlyList<PetResponse>> GetMyPetsAsync(string applicationUserId);
    Task<PetResponse?> GetMyPetAsync(string applicationUserId, int petId);
    Task<PetResponse> CreateAsync(string applicationUserId, CreatePetRequest request);
    Task<bool> UpdateAsync(string applicationUserId, int petId, UpdatePetRequest request);
    Task<bool> DeleteAsync(string applicationUserId, int petId);
}