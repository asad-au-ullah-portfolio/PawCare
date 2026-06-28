namespace PawCare.Server.Enums;

public enum VeterinarianSpecialty
{
    // General & Primary Care
    GeneralMedicine = 1,      // Standard wellness exams, vaccines, general care
    EmergencyAndCriticalCare, // ER, trauma, and urgent life-saving care

    // Specialized Anatomy & Medicine
    Surgery,                 // Orthopedic and soft-tissue surgical procedures
    InternalMedicine,        // Complex chronic diseases (e.g., diabetes, renal failure)
    Dermatology,             // Skin conditions and allergies
    Cardiology,              // Heart conditions and cardiovascular health
    Oncology,                // Cancer treatments and chemotherapy
    Dentistry,               // Oral surgeries, teeth cleanings, and extractions

    // Animal Group Specialists
    ExoticAnimals,           // Birds, reptiles, rodents, and pocket pets
    EquineAndLargeAnimal     // Horses, cattle, and farm livestock
}
