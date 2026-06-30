using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace PawCare.Server.Migrations
{
    /// <inheritdoc />
    public partial class SeedVeterinarians : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "ConsultationFee",
                table: "Veterinarians",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "YearsOfExperience",
                table: "Veterinarians",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "ConcurrencyStamp", "Email", "EmailConfirmed", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "SecurityStamp", "TwoFactorEnabled", "UserName" },
                values: new object[,]
                {
                    { "vet-seed-0001", 0, "vet-seed-0001", "sarah.mitchell@pawcare-vet.test", true, false, null, "SARAH.MITCHELL@PAWCARE-VET.TEST", "SARAH.MITCHELL@PAWCARE-VET.TEST", "AQAAAAIAAYagAAAAEJCZc3vwf1fiRepOISIEe1oZtgbyM7WaskhzadRRo198RUfp1jwiQmMPPd7ykWIOhA==", null, false, "vet-seed-0001", false, "sarah.mitchell@pawcare-vet.test" },
                    { "vet-seed-0002", 0, "vet-seed-0002", "daniel.okafor@pawcare-vet.test", true, false, null, "DANIEL.OKAFOR@PAWCARE-VET.TEST", "DANIEL.OKAFOR@PAWCARE-VET.TEST", "AQAAAAIAAYagAAAAEGPeMNESI1AyHiEnxFcZgGJuAXVJyQ5vDemZQg1zZKW78BWHI1SbNUnWvwYmqM+sgw==", null, false, "vet-seed-0002", false, "daniel.okafor@pawcare-vet.test" },
                    { "vet-seed-0003", 0, "vet-seed-0003", "priya.nair@pawcare-vet.test", true, false, null, "PRIYA.NAIR@PAWCARE-VET.TEST", "PRIYA.NAIR@PAWCARE-VET.TEST", "AQAAAAIAAYagAAAAEIy2tffpV/UNTeU5IIryMPdrgWBprd1bXbEAIjWMJMv+NcJlsi9KWxpfnz1Cse3YsQ==", null, false, "vet-seed-0003", false, "priya.nair@pawcare-vet.test" },
                    { "vet-seed-0004", 0, "vet-seed-0004", "james.whitfield@pawcare-vet.test", true, false, null, "JAMES.WHITFIELD@PAWCARE-VET.TEST", "JAMES.WHITFIELD@PAWCARE-VET.TEST", "AQAAAAIAAYagAAAAEPG5tvVWZ35M5290SdZJWmepJmiD4cn8nr39wEBooj6wOteeaVkiBaR1O3UFIPavIA==", null, false, "vet-seed-0004", false, "james.whitfield@pawcare-vet.test" },
                    { "vet-seed-0005", 0, "vet-seed-0005", "elena.vasquez@pawcare-vet.test", true, false, null, "ELENA.VASQUEZ@PAWCARE-VET.TEST", "ELENA.VASQUEZ@PAWCARE-VET.TEST", "AQAAAAIAAYagAAAAEG0FQR/Zn2C/Xw503lmL+QxN26Gpb9ekt66lOSARPkKjKV/AmJmn6zfYCGcGSbxWDQ==", null, false, "vet-seed-0005", false, "elena.vasquez@pawcare-vet.test" }
                });

            migrationBuilder.InsertData(
                table: "Veterinarians",
                columns: new[] { "Id", "ApplicationUserId", "ConsultationFee", "FirstName", "LastName", "LicenseNumber", "Specialty", "YearsOfExperience" },
                values: new object[,]
                {
                    { 1, "vet-seed-0001", 50.00m, "Sarah", "Mitchell", "VET-0001", "GeneralPractice", 8 },
                    { 2, "vet-seed-0002", 120.00m, "Daniel", "Okafor", "VET-0002", "Surgery", 12 },
                    { 3, "vet-seed-0003", 65.00m, "Priya", "Nair", "VET-0003", "Dermatology", 6 },
                    { 4, "vet-seed-0004", 150.00m, "James", "Whitfield", "VET-0004", "Cardiology", 15 },
                    { 5, "vet-seed-0005", 90.00m, "Elena", "Vasquez", "VET-0005", "ExoticAnimals", 9 }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Veterinarians",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Veterinarians",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Veterinarians",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Veterinarians",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Veterinarians",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "vet-seed-0001");

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "vet-seed-0002");

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "vet-seed-0003");

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "vet-seed-0004");

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "vet-seed-0005");

            migrationBuilder.DropColumn(
                name: "ConsultationFee",
                table: "Veterinarians");

            migrationBuilder.DropColumn(
                name: "YearsOfExperience",
                table: "Veterinarians");
        }
    }
}
