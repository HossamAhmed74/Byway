using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyApp.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class addCostColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Courses_Categoriers_CategoriersId",
                table: "Courses");

            migrationBuilder.DropIndex(
                name: "IX_Courses_CategoriersId",
                table: "Courses");

            migrationBuilder.DropColumn(
                name: "CategoriersId",
                table: "Courses");

            migrationBuilder.AddColumn<double>(
                name: "Cost",
                table: "Courses",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.CreateIndex(
                name: "IX_Courses_CategoryId",
                table: "Courses",
                column: "CategoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_Courses_Categoriers_CategoryId",
                table: "Courses",
                column: "CategoryId",
                principalTable: "Categoriers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Courses_Categoriers_CategoryId",
                table: "Courses");

            migrationBuilder.DropIndex(
                name: "IX_Courses_CategoryId",
                table: "Courses");

            migrationBuilder.DropColumn(
                name: "Cost",
                table: "Courses");

            migrationBuilder.AddColumn<int>(
                name: "CategoriersId",
                table: "Courses",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Courses_CategoriersId",
                table: "Courses",
                column: "CategoriersId");

            migrationBuilder.AddForeignKey(
                name: "FK_Courses_Categoriers_CategoriersId",
                table: "Courses",
                column: "CategoriersId",
                principalTable: "Categoriers",
                principalColumn: "Id");
        }
    }
}
