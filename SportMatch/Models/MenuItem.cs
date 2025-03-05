namespace SportMatch.Models;

public class MenuItem
{
    public string Icon { get; set; }  // FontAwesome 圖示
    public string Name { get; set; }  // 選單名稱
    public string Url { get; set; }   // 路徑

    public MenuItem(string icon, string name, string url)
    {
        Icon = icon;
        Name = name;
        Url = url;
    }
}