import { bus } from '../components/event-bus.js';

setBus(bus);
let initData = {
  choice_main: 1,

  choice_simple: 1,
  choice_combined: 1,

  seek_max_speed: 10,
  seek_max_force: 50,

  flee_max_speed: 7,
  flee_max_force: 20,

  pursue_max_speed: 7,
  pursue_max_force: 20,
  pursue_prediction: 2,
  pursue_target_speed: 5,
  
  evasion_max_speed: 7,
  evasion_max_force: 20,
  evasion_prediction: 2,
  evasion_target_speed: 5,

  wander_max_speed: 4,
  wander_max_force: 5,
  wander_angle_change: 20,
  wander_radius: 20,
  wander_distance: 100,

  arrival_max_speed: 10,
  arrival_max_force: 50,
  arrival_slow_radius: 125,

  offset_pursuit_max_speed: 7,
  offset_pursuit_max_force: 20,
  offset_pursuit_target_speed: 6,
  offset_pursuit_offset: 40,

  obstacle_avoidance_max_speed: 8,
  obstacle_avoidance_max_force: 30,
  obstacle_avoidance_ahead: 100,

  containment_max_speed: 7,
  containment_max_force: 50,
  containment_ahead: 100,

  wall_following_max_speed: 4,
  wall_following_max_force: 50,
  wall_following_ahead: 40,
  wall_following_offset: 25,

  path_following_max_speed: 8,
  path_following_max_force: 50,
  path_following_ahead: 50,
  path_following_radio: 1,

  flow_field_max_speed: 10,
  flow_field_max_force: 30,
  flow_field_ahead: 15,
  flow_field_radio: 1,

  crowd_path_following_max_speed: 6,
  crowd_path_following_max_force: 75,
  crowd_path_following_ahead: 50,

  collision_avoidance_max_speed: 5,
  collision_avoidance_max_force: 20,
  collision_avoidance_ahead: 50,

  queuing_max_speed: 5,
  queuing_max_force: 20,
  queuing_ahead: 50,

  leader_max_speed: 5,
  leader_max_force: 15,
  leader_distance: 100,
  follower_max_speed: 8,
  follower_max_force: 40,

  flocking_max_speed: 8,
  flocking_max_force: 30
};
setData(initData);

let simple_options_list = ['seek_options', 'flee_options', 'pursue_options', 'evasion_options', 
  'wander_options', 'arrival_options', 'offset_pursuit_options', 'obstacle_avoidance_options', 
  'containment_options', 'wall_following_options', 'path_following_options', 'flow_field_options'
];

let combined_options_list = ['crowd_path_following_options', 'collision_avoidance_options', 
  'queuing_options', 'leader_following_options', 'flocking_options'
];

document.getElementById('choice_main').onclick = e => {
  let val = Number(e.target.value);
  if (val) {
    bus.dispatch("ControlASAcm", { choice_main: val });
    document.getElementById('choice_simple').style.display = (val == 1 ? 'grid' : 'none');
    document.getElementById('choice_combined').style.display = (val == 2 ? 'grid' : 'none');
    hideOptions();
    let elemId = val == 1 ? 
      simple_options_list[choice_simple-1] : combined_options_list[choice_combined-1];
    document.getElementById(elemId).style.display = 'block';
    toggleClassForElement(document.getElementById('sketch-holder'), 'clickable', (choice_main == 1 && choice_simple != 11));
  }
};

document.getElementById('choice_simple').style.display = (choice_main == 1 ? 'grid' : 'none');
document.getElementById('choice_combined').style.display = (choice_main == 2 ? 'grid' : 'none');
toggleClassForElement(document.getElementById('sketch-holder'), 'clickable', (choice_main == 1 && choice_simple != 11));

document.getElementById('choice_simple').onclick = e => {
  let val = Number(e.target.value);
  if (val) {
    bus.dispatch("ControlASAcr", { choice_simple: val });
    hideOptions();
    document.getElementById(simple_options_list[val-1]).style.display = 'block';
    toggleClassForElement(document.getElementById('sketch-holder'), 'clickable', (choice_simple != 11));
  }
};

document.getElementById('choice_combined').onclick = e => {
  let val = Number(e.target.value);
  if (val) {
    bus.dispatch("ControlASAcrc", { choice_combined: val });
    hideOptions();
    document.getElementById(combined_options_list[val-1]).style.display = 'block';
    toggleClassForElement(document.getElementById('sketch-holder'), 'clickable', (false));
  }
};

function hideOptions() {
  simple_options_list.forEach( op => document.getElementById(op).style.display = 'none' );
  combined_options_list.forEach( op => document.getElementById(op).style.display = 'none' );
}

// seek

document.getElementById('seek_options').style.display = (choice_main == 1 && choice_simple == 1 ? 'block' : 'none');

document.getElementById('seek_max_speed').value = initData.seek_max_speed;

document.getElementById('seek_max_speed').onclick = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControASAssms", { seek_max_speed: val });
};

document.getElementById('seek_max_force').value = initData.seek_max_force;

document.getElementById('seek_max_force').onclick = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControASAssmf", { seek_max_force: val });
};

// flee

document.getElementById('flee_options').style.display = (choice_main == 1 && choice_simple == 2 ? 'block' : 'none');

document.getElementById('flee_max_speed').value = initData.flee_max_speed;

document.getElementById('flee_max_speed').onclick = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControASAsfms", { flee_max_speed: val });
};

document.getElementById('flee_max_force').value = initData.flee_max_force;

document.getElementById('flee_max_force').onclick = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControASAsfmf", { flee_max_force: val });
};

// pursue

document.getElementById('pursue_options').style.display = (choice_main == 1 && choice_simple == 3 ? 'block' : 'none');

document.getElementById('pursue_max_speed').value = initData.pursue_max_speed;

document.getElementById('pursue_max_speed').onclick = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControASAspms", { pursue_max_speed: val });
};

document.getElementById('pursue_max_force').value = initData.pursue_max_force;

document.getElementById('pursue_max_force').onclick = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControASAspmf", { pursue_max_force: val });
};

document.getElementById('pursue_prediction').value = initData.pursue_prediction;

document.getElementById('pursue_prediction').onclick = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControASAspp", { pursue_prediction: val });
};

document.getElementById('pursue_target_speed').value = initData.pursue_target_speed;

document.getElementById('pursue_target_speed').onclick = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControASAspts", { pursue_target_speed: val });
};

// evasion

document.getElementById('evasion_options').style.display = (choice_main == 1 && choice_simple == 4 ? 'block' : 'none');

document.getElementById('evasion_max_speed').value = initData.evasion_max_speed;

document.getElementById('evasion_max_speed').onclick = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControASAsems", { evasion_max_speed: val });
};

document.getElementById('evasion_max_force').value = initData.evasion_max_force;

document.getElementById('evasion_max_force').onclick = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControASAsemf", { evasion_max_force: val });
};

document.getElementById('evasion_prediction').value = initData.evasion_prediction;

document.getElementById('evasion_prediction').onclick = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControASAsep", { evasion_prediction: val });
};

document.getElementById('evasion_target_speed').value = initData.evasion_target_speed;

document.getElementById('evasion_target_speed').onclick = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControASAsets", { evasion_target_speed: val });
};

// wander

document.getElementById('wander_options').style.display = (choice_main == 1 && choice_simple == 5 ? 'block' : 'none');

document.getElementById('wander_max_speed').value = initData.wander_max_speed;

document.getElementById('wander_max_speed').onclick = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControASAswms", { wander_max_speed: val });
};

document.getElementById('wander_max_force').value = initData.wander_max_force;

document.getElementById('wander_max_force').onclick = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControASAswmf", { wander_max_force: val });
};

document.getElementById('wander_angle_change').value = initData.wander_angle_change;

document.getElementById('wander_angle_change').onclick = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControASAswac", { wander_angle_change: val });
};

document.getElementById('wander_radius').value = initData.wander_radius;

document.getElementById('wander_radius').onclick = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControASAswr", { wander_radius: val });
};

document.getElementById('wander_distance').value = initData.wander_distance;

document.getElementById('wander_distance').onclick = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControASAswd", { wander_distance: val });
};

// arrival

document.getElementById('arrival_options').style.display = (choice_main == 1 && choice_simple == 6 ? 'block' : 'none');

document.getElementById('arrival_max_speed').value = initData.arrival_max_speed;

document.getElementById('arrival_max_speed').onclick = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControASAsams", { arrival_max_speed: val });
};

document.getElementById('arrival_max_force').value = initData.arrival_max_force;

document.getElementById('arrival_max_force').onclick = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControASAsamf", { arrival_max_force: val });
};

document.getElementById('arrival_slow_radius').value = initData.arrival_slow_radius;

document.getElementById('arrival_slow_radius').onclick = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControASAsasd", { arrival_slow_radius: val });
};

// offset pursuit

document.getElementById('offset_pursuit_options').style.display = 
  (choice_main == 1 && choice_simple == 7 ? 'block' : 'none');

document.getElementById('offset_pursuit_max_speed').value = initData.offset_pursuit_max_speed;

document.getElementById('offset_pursuit_max_speed').onclick = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControASAsopms", { offset_pursuit_max_speed: val });
};

document.getElementById('offset_pursuit_max_force').value = initData.offset_pursuit_max_force;

document.getElementById('offset_pursuit_max_force').onclick = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControASAsopmf", { offset_pursuit_max_force: val });
};

document.getElementById('offset_pursuit_target_speed').value = initData.offset_pursuit_target_speed;

document.getElementById('offset_pursuit_target_speed').onclick = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControASAsopts", { offset_pursuit_target_speed: val });
};

document.getElementById('offset_pursuit_offset').value = initData.offset_pursuit_offset;

document.getElementById('offset_pursuit_offset').onclick = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControASAsopo", { offset_pursuit_offset: val });
};

// obstacle avoidance

document.getElementById('obstacle_avoidance_options').style.display = (choice_main == 1 && choice_simple == 8 ? 'block' : 'none');

document.getElementById('obstacle_avoidance_max_speed').value = initData.obstacle_avoidance_max_speed;

document.getElementById('obstacle_avoidance_max_speed').onclick = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControASAsoams", { obstacle_avoidance_max_speed: val });
};

document.getElementById('obstacle_avoidance_max_force').value = initData.obstacle_avoidance_max_force;

document.getElementById('obstacle_avoidance_max_force').onclick = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControASAsoamf", { obstacle_avoidance_max_force: val });
};

document.getElementById('obstacle_avoidance_ahead').value = initData.obstacle_avoidance_ahead;

document.getElementById('obstacle_avoidance_ahead').onclick = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControASAsoaa", { obstacle_avoidance_ahead: val });
};

// containment

document.getElementById('containment_options').style.display = (choice_main == 1 && choice_simple == 9 ? 'block' : 'none');

document.getElementById('containment_max_speed').value = initData.containment_max_speed;

document.getElementById('containment_max_speed').onclick = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControASAscms", { containment_max_speed: val });
};

document.getElementById('containment_max_force').value = initData.containment_max_force;

document.getElementById('containment_max_force').onclick = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControASAscmf", { containment_max_force: val });
};

document.getElementById('containment_ahead').value = initData.containment_ahead;

document.getElementById('containment_ahead').onclick = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControASAsca", { containment_ahead: val });
};

// wall following

document.getElementById('wall_following_options').style.display = (choice_main == 1 && choice_simple == 10 ? 'block' : 'none');

document.getElementById('wall_following_max_speed').value = initData.wall_following_max_speed;

document.getElementById('wall_following_max_speed').onclick = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControASAswfms", { wall_following_max_speed: val });
};

document.getElementById('wall_following_max_force').value = initData.wall_following_max_force;

document.getElementById('wall_following_max_force').onclick = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControASAswfmf", { wall_following_max_force: val });
};

document.getElementById('wall_following_ahead').value = initData.wall_following_ahead;

document.getElementById('wall_following_ahead').onclick = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControASAswfa", { wall_following_ahead: val });
};

document.getElementById('wall_following_offset').value = initData.wall_following_offset;

document.getElementById('wall_following_offset').onclick = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControASAswfo", { wall_following_offset: val });
};

// path following

document.getElementById('path_following_options').style.display = (choice_main == 1 && choice_simple == 11 ? 'block' : 'none');

document.getElementById('path_following_max_speed').value = initData.path_following_max_speed;

document.getElementById('path_following_max_speed').onclick = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControASAspfms", { path_following_max_speed: val });
};

document.getElementById('path_following_max_force').value = initData.path_following_max_force;

document.getElementById('path_following_max_force').onclick = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControASAspfmf", { path_following_max_force: val });
};

document.getElementById('path_following_ahead').value = initData.path_following_ahead;

document.getElementById('path_following_ahead').onclick = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControASAspfa", { path_following_ahead: val });
};

document.getElementById('path_following_radio').onclick = e => {
  let val = Number(e.target.value);
  if (val) {
    bus.dispatch("ControASAspfr", { path_following_radio: val });
  }
};

// flow field

document.getElementById('flow_field_options').style.display = (choice_main == 1 && choice_simple == 12 ? 'block' : 'none');

document.getElementById('flow_field_max_speed').value = initData.flow_field_max_speed;

document.getElementById('flow_field_max_speed').onclick = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControASAsffms", { flow_field_max_speed: val });
};

document.getElementById('flow_field_max_force').value = initData.flow_field_max_force;

document.getElementById('flow_field_max_force').onclick = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControASAsffmf", { flow_field_max_force: val });
};

document.getElementById('flow_field_ahead').value = initData.flow_field_ahead;

document.getElementById('flow_field_ahead').onclick = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControASAsffa", { flow_field_ahead: val });
};

document.getElementById('flow_field_radio').onclick = e => {
  let val = Number(e.target.value);
  if (val) {
    bus.dispatch("ControASAcffr", { flow_field_radio: val });
  }
};

// crowd path following

document.getElementById('crowd_path_following_options').style.display = (choice_main == 2 && choice_combined == 1 ? 'block' : 'none');

document.getElementById('crowd_path_following_max_speed').value = initData.crowd_path_following_max_speed;

document.getElementById('crowd_path_following_max_speed').onclick = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControASAscpfms", { crowd_path_following_max_speed: val });
};

document.getElementById('crowd_path_following_max_force').value = initData.crowd_path_following_max_force;

document.getElementById('crowd_path_following_max_force').onclick = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControASAscpfmf", { crowd_path_following_max_force: val });
};

document.getElementById('crowd_path_following_ahead').value = initData.crowd_path_following_ahead;

document.getElementById('crowd_path_following_ahead').onclick = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControASAscpfa", { crowd_path_following_ahead: val });
};

// unaligned collision avoidance

document.getElementById('collision_avoidance_options').style.display = (choice_main == 2 && choice_combined == 2 ? 'block' : 'none');

document.getElementById('collision_avoidance_max_speed').value = initData.collision_avoidance_max_speed;

document.getElementById('collision_avoidance_max_speed').onclick = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControASAsucams", { collision_avoidance_max_speed: val });
};

document.getElementById('collision_avoidance_max_force').value = initData.collision_avoidance_max_force;

document.getElementById('collision_avoidance_max_force').onclick = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControASAsucamf", { collision_avoidance_max_force: val });
};

document.getElementById('collision_avoidance_ahead').value = initData.collision_avoidance_ahead;

document.getElementById('collision_avoidance_ahead').onclick = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControASAsucaa", { collision_avoidance_ahead: val });
};

// queuing

document.getElementById('queuing_options').style.display = (choice_main == 2 && choice_combined == 3 ? 'block' : 'none');

document.getElementById('queuing_max_speed').value = initData.queuing_max_speed;

document.getElementById('queuing_max_speed').onclick = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControASAsqms", { queuing_max_speed: val });
};

document.getElementById('queuing_max_force').value = initData.queuing_max_force;

document.getElementById('queuing_max_force').onclick = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControASAsqmf", { queuing_max_force: val });
};

document.getElementById('queuing_ahead').value = initData.queuing_ahead;

document.getElementById('queuing_ahead').onclick = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControASAsqa", { queuing_ahead: val });
};

// leader following

document.getElementById('leader_following_options').style.display = (choice_main == 2 && choice_combined == 4 ? 'block' : 'none');

document.getElementById('leader_max_speed').value = initData.leader_max_speed;

document.getElementById('leader_max_speed').onclick = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControASAslflms", { leader_max_speed: val });
};

document.getElementById('leader_max_force').value = initData.leader_max_force;

document.getElementById('leader_max_force').onclick = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControASAslflmf", { leader_max_force: val });
};

document.getElementById('leader_distance').value = initData.leader_distance;

document.getElementById('leader_distance').onclick = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControASAslfld", { leader_distance: val });
};

document.getElementById('follower_max_speed').value = initData.follower_max_speed;

document.getElementById('follower_max_speed').onclick = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControASAslffms", { follower_max_speed: val });
};

document.getElementById('follower_max_force').value = initData.follower_max_force;

document.getElementById('follower_max_force').onclick = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControASAslffmf", { follower_max_force: val });
};

// flocking

document.getElementById('flocking_options').style.display = (choice_main == 2 && choice_combined == 5 ? 'block' : 'none');

document.getElementById('flocking_max_speed').value = initData.flocking_max_speed;

document.getElementById('flocking_max_speed').onclick = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControASAsflms", { flocking_max_speed: val });
};

document.getElementById('flocking_max_force').value = initData.flocking_max_force;

document.getElementById('flocking_max_force').onclick = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControASAsflmf", { flocking_max_force: val });
};