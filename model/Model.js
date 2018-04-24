
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

function parseTopolgyXML(xml,num)
{
  var i;
  var xmlDoc = xml.responseXML;
  var links = xmlDoc.getElementsByTagName("LINKS");

  graph_message.e=links[0].childNodes[0].nodeValue;
  graph_message.n = num;
  //graph_message.e = links[0].childNodes[0].nodeValue;

  console.log(graph_message.e);

  //   delete
  var tables = xmlDoc.getElementsByTagName("VT");
  if(tables.length!=num){
    return;
  }
  for (i = 0;i<tables.length;i++){
    console.log(tables[i].childNodes[0].nodeValue);
  }

}
