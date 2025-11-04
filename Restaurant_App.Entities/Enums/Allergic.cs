namespace Restaurant_App.Entities.Enums
{
    [Flags]
    public enum Allergic
    {
        None = 0,       // 0
        Gluten = 1,     // 1
        Nuts = 2,       // 10 (binary)
        Dairy = 4,      // 100 (binary)
        Soy = 8,
        Eggs = 16,
        Shellfish = 32,
        Fish = 64,
        Peanuts = 128,
        TreeNuts = 256,
        Wheat = 512,
        Sesame = 1024
    }
}
