var act = -1;

{
    let get = localStorage.getItem("treestuck");
    if (get===null || get===undefined) act = -1
    else act = JSON.parse(atob(get)).act ?? -1
}