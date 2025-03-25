namespace SportMatch.Models.DTOs;

public class SportUpdateAllDto
{
    public UserUpdateDto User { get; set; }
    public List<SportUpdateDto> Sport { get; set; }
}

//會員基本資料
public class UserUpdateDto
{
    public string UserMemo { get; set; }
    public int AreaId { get; set; }
    public string Invited { get; set; }
}

//會員運動資料
public class SportUpdateDto
{
    public int SportId { get; set; }
    public string RoleId { get; set; }
}