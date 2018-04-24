
// node_num== node number, int
// mode==0 blank,
// mode==1 stable.
function initTopology(node_num,mode)
{
    if(node_num<3||node_num>7){
      return;
    }

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        parseTopolgyXML(this,node_num,mode);
      }
    };
    xhttp.open("GET", "./model/"+node_num.toString()+".xml", true);
    xhttp.send();
}

function parseTopolgyXML(xml,n,mode)
{
  var i;
  var xmlDoc = xml.responseXML;
  var links = xmlDoc.getElementsByTagName("LINK");
  for (i = 0; i <links.length; i++) {
    console.log(links[i].childNodes[0].nodeValue);
  }

  var tables = xmlDoc.getElementsByTagName("VT");
  if(tables.length!=n){
    return;
  }
  for (i = 0;i<tables.length;i++){
    console.log(tables[i].childNodes[0].nodeValue);
  }

}
