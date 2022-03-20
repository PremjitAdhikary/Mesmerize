import { bus } from '../components/event-bus.js';

setBus(bus);

document.getElementById('jumble').onclick = () => bus.dispatch("ControlSPbj", { });

document.getElementById('random').onclick = () => bus.dispatch("ControlSPbr", { });