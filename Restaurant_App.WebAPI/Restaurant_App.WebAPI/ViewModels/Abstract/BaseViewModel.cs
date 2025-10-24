namespace Restaurant_App.WebAPI.ViewModels.Abstract
{
    public abstract class BaseViewModel<T> where T : class
    {
        public T? Data { get; set; }
        public bool IsSuccess { get; set; }
        public string? Message { get; set; }
        public List<string>? Errors { get; set; }
    }
}
