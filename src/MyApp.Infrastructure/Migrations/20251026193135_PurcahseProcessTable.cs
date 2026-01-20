using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyApp.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class PurcahseProcessTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Courses_PurchaseProcess_PurchaseProcessId",
                table: "Courses");

            migrationBuilder.DropIndex(
                name: "IX_Courses_PurchaseProcessId",
                table: "Courses");

            migrationBuilder.DropColumn(
                name: "PurchaseProcessId",
                table: "Courses");

            migrationBuilder.RenameColumn(
                name: "UserID",
                table: "PurchaseProcess",
                newName: "UserId");

            migrationBuilder.AddColumn<string>(
                name: "CoursesIds",
                table: "PurchaseProcess",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CoursesIds",
                table: "PurchaseProcess");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "PurchaseProcess",
                newName: "UserID");

            migrationBuilder.AddColumn<int>(
                name: "PurchaseProcessId",
                table: "Courses",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Courses_PurchaseProcessId",
                table: "Courses",
                column: "PurchaseProcessId");

            migrationBuilder.AddForeignKey(
                name: "FK_Courses_PurchaseProcess_PurchaseProcessId",
                table: "Courses",
                column: "PurchaseProcessId",
                principalTable: "PurchaseProcess",
                principalColumn: "Id");
        }
    }
}
