using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Restaurant_App.DataAccess.Migrations.RestaurantDb
{
    /// <inheritdoc />
    public partial class AddReservationStatusAndOrderUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "Reservations",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "OrdersInRestaurant",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Status",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "OrdersInRestaurant");
        }
    }
}
