import { bus } from '../components/event-bus.js';

document.getElementById('query_box_x').value = 0;
document.getElementById('query_box_y').value = 0;
document.getElementById('query_box_z').value = 0;

let qbChange = () => {
  bus.dispatch("ControlOTVqb", { 
    query_box_x: parseInt(document.getElementById('query_box_x').value),
    query_box_y: parseInt(document.getElementById('query_box_y').value),
    query_box_z: parseInt(document.getElementById('query_box_z').value) 
  });
};
document.getElementById('query_box_x').onchange = e => qbChange();
document.getElementById('query_box_y').onchange = e => qbChange();
document.getElementById('query_box_z').onchange = e => qbChange();

qbChange();

let addToTree = (num) => bus.dispatch("ControlOTVap", { num });

document.getElementById('add_10').onclick = () => addToTree(10);
document.getElementById('add_20').onclick = () => addToTree(20);
document.getElementById('add_30').onclick = () => addToTree(30);
