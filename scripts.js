
table_div = document.getElementById("table_div");

table_contents = "<table><tr><th>Server</th><th>Server ID</th><th>Population</th><th>Hossin Viability</th></tr>";

base_URL = "http://census.daybreakgames.com";
service_ID = "/s:freeongtaxi";
request_type = "/get";
PS2_API_version = "/ps2:v2";
DGC_request_URL_base = base_URL + service_ID + request_type +  PS2_API_version;

fisu_pop_URL = "https://ps2.fisu.pw/api/population";
fisu_terry_URL = "https://ps2.fisu.pw/api/territory";

servers_URL =  DGC_request_URL_base + "/world/?c:limit=100";
server_info_URL = fisu_pop_URL + "/?world=1,10,13,17,19,40";

let CORS_bypass = "https://secret-ocean-49799.herokuapp.com/";

let url_miller = fisu_terry_URL + "/?world=" + "10" + "&continent=4";


function build_table(){
    getServers(CORS_bypass + servers_URL, CORS_bypass + server_info_URL)
    .then(([servers, server_info]) =>{

        servers = servers.world_list;

        let server_pop = 0;
        servers.forEach(server => {
            hossin_viability = true;
            if(server.name.en != "Briggs"){
                server_pop = (server_info["result"][server["world_id"]][0]["nc"] 
                        + server_info["result"][server["world_id"]][0]["tr"] 
                        + server_info["result"][server["world_id"]][0]["vs"] 
                        + server_info["result"][server["world_id"]][0]["ns"]);
                if (server_pop > 600){
                    let server_terry_caps;
                    while(typeof server_terry_caps === "undefined"){
                        try{
                            server_terry_caps = fetch_data_from_URL(CORS_bypass + fisu_terry_URL + "/?world=" + [server["world_id"]][0] + "&continent=4");
                        }
                        catch(err){
                            console.log("shits fucked for " + server["name"]["en"] + "... trying again " + err);
                            sleep(15000);
                        }
                    }
                    
                    server_terry_caps.then((res) => {
                        console.log(res.result[0].continents[0].control);
                        continent_terrys = res.result[0].continents[0].control;
                        continent_terrys.forEach(cap => {
                            console.log(cap);
                            if(parseInt(cap) > 40){
                                console.log("setting hossing to false");
                                hossin_viability = false;
                            }
                        })
                    });
                }
                else {
                    hossin_viability = false;
                }
            }
            
            if(server.name.en != "Briggs"){
                table_contents += ("<tr>" + "<td>" + server.name.en + "</td>" + "<td>" + server.world_id + "</td>" + "<td>" + server_pop + "</td>" + "<td>" + hossin_viability + "</td>" + "</tr>");
            }
        });

    table_contents += "</table>";
    table_div.innerHTML = table_contents;
    });
}

function fetch_data_from_URL(url){
    return fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
    .then(res => res.json())
    .catch(err => {throw err});
}

function getServers(url, url2){
    return Promise.all([fetch_data_from_URL(url), fetch_data_from_URL(url2)]);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

build_table();