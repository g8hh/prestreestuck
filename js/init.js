var act = 0;

{
    let get = localStorage.getItem("treestuck");
    if (get===null || get===undefined) act = 0
    act = JSON.parse(atob(get)).act || 0
}