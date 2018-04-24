
// node_num== node number, int
// mode==0 blank,
// mode==1 stable.

//var graph_message = {};

function initTopology(node_num)
{
    if(node_num<3||node_num>7){
      return;
    }

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        parseTopolgyXML(this,node_num);
      }
    };
    xhttp.open("GET", "./model/"+node_num.toString()+".xml", false);
    xhttp.send();
}

function readStableGraphTable(node_num)
{
  if(node_num<3||node_num>7){
    return;
  }

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      parseGraphTable(this,node_num);
    }
  };
  xhttp.open("GET", "./model/"+node_num.toString()+".xml", false);
  xhttp.send();
}

function parseTopolgyXML(xml,num)
{
  var i;
  var xmlDoc = xml.responseXML;
  var links = xmlDoc.getElementsByTagName("LINKS");
  var linknum = xmlDoc.getElementsByTagName("LINKNUM");

  graph_message.e=links[0].childNodes[0].nodeValue;
  graph_message.n = Number(linknum[0].childNodes[0].nodeValue);

  var pos = xmlDoc.getElementsByTagName("POS");
  var pos_string = pos[0].childNodes[0].nodeValue;
  var pos_list = [];

  i=0;
  while(i<pos_string.length){
    if(pos_string.charAt(i)!=','){
      pos_list.push(Number(pos_string.charAt(i))*150-100);
    }
    i = i+1;
  }
  
  view_graph_parameters[num-1].pos=pos_list;
  //graph_message.e = links[0].childNodes[0].nodeValue;

  //console.log(graph_message.e);


}

function parseGraphTable(xml,num)
{
  var i;
  var xmlDoc = xml.responseXML;
  var tables = xmlDoc.getElementsByTagName("VT");

  if(tables.length!=num){
    return;
  }

  for(i=0;i<tables;i++){
    console.log(tables[i].childNodes[0].nodeValue);
  }

}
