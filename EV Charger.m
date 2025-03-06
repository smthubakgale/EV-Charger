model = 'EV_Charging_Station_V2G_Multi_Battery';

% Create the grid connection
grid_voltage = 400;
grid_frequency = 50;
grid = simscape.electrical.sources.ConstantVoltage(grid_voltage, grid_frequency);

% Create the bi-directional converter
converter = simscape.electrical.elements.BidirectionalConverter(100e3, 400);

% Create the DC fast charger
dc_fast_charger = simscape.electrical.elements.DC_DCMotor(ChargePoint_Express_250());

% Create the batteries
battery1 = simscape.electrical.battery.Battery(Nissan_Leaf_Battery(), 0.2); % 20% initial charge
battery2 = simscape.electrical.battery.Battery(Nissan_Leaf_Battery(), 0.4); % 40% initial charge
battery3 = simscape.electrical.battery.Battery(Nissan_Leaf_Battery(), 0.6); % 60% initial charge
battery4 = simscape.electrical.battery.Battery(Nissan_Leaf_Battery(), 0.8); % 80% initial charge
battery5 = simscape.electrical.battery.Battery(Nissan_Leaf_Battery(), 0.95); % 95% initial charge

% Create the battery management system
bms = simscape.electrical.control.BatteryManagementSystem(Texas_Instruments_BQ76940());

% Create a user input block to control the grid feeding permission
user_input = simscape.electrical.control.UserInput();
user_input.Name = 'GridFeedingPermission';

% Create a control system to monitor the battery SOC and control the bi-directional converter
control_system = simscape.electrical.control.ControlSystem();

% Add a SOC monitor to the control system
soc_monitor = simscape.electrical.control.SOCMonitor();
control_system.addBlock(soc_monitor, 'SOC_Monitor');

% Add a comparator to the control system to compare the SOC to 100%
comparator1 = simscape.electrical.control.Comparator();
comparator1.UpperLimit = 1; % 100% SOC
control_system.addBlock(comparator1, 'SOC_Comparator1');

% Add a comparator to the control system to compare the SOC to 80%
comparator2 = simscape.electrical.control.Comparator();
comparator2.UpperLimit = 0.8; % 80% SOC
control_system.addBlock(comparator2, 'SOC_Comparator2');

% Add a logical AND gate to the control system
and_gate1 = simscape.electrical.control.LogicalAND();
control_system.addBlock(and_gate1, 'AND_Gate1');

% Add a logical AND gate to the control system
and_gate2 = simscape.electrical.control.LogicalAND();
control_system.addBlock(and_gate2, 'AND_Gate2');

% Add a switch to the control system to control the bi-directional converter
switch_block = simscape.electrical.control.Switch();
control_system.addBlock(switch_block, 'Charge_Switch');

% Connect the SOC monitor to the comparators
connect(soc_monitor, comparator1, 'SOC');
connect(soc_monitor, comparator2, 'SOC');

% Connect the comparators to the AND gates
connect(comparator1, and_gate1, 'Input1');
connect(user_input, and_gate1, 'Input2');
connect(comparator2, and_gate2, 'Input1');
connect(user_input, and_gate2, 'Input2');

% Connect the AND gates to the switch
connect(and_gate1, switch_block, 'Control');
connect(and_gate2, switch_block, 'Control');

% Connect the switch to the bi-directional converter
connect(switch_block, converter, 'Control');

% Connect the components
connect(grid, converter);
connect(converter, dc_fast_charger);
connect(dc_fast_charger, battery1);
connect(dc_fast_charger, battery2);
connect(dc_fast_charger, battery3);
connect(dc_fast_charger, battery4);
connect(dc_fast_charger, battery5);
connect(battery1, bms);
connect(battery2, bms);
connect(battery3, bms);
connect(battery4, bms);
connect(battery5, bms);

% Set up the simulation
sim_time = 3600; % 1 hour
sample_time = 1;
sim_out = sim(model, sim_time);

% Get the simulation results
soc1 = sim_out.logsout.get('Battery1_SOC').Values.Data;
soc2 = sim_out.logsout.get('Battery2_SOC').Values.Data;
soc3 = sim_out.logsout.get('Battery3_SOC').Values.Data;
soc4 = sim_out.logsout.get('Battery4_SOC').Values.Data;
soc5 = sim_out.logsout.get('Battery5_SOC').Values.Data;

voltage1 = sim_out.logsout.get('Battery1_Voltage').Values.Data;
voltage2 = sim_out.logsout.get('Battery2_Voltage').Values.Data;
voltage3 = sim_out.logsout.get('Battery3_Voltage').Values.Data;
voltage4 = sim_out.logsout.get('Battery4_Voltage').Values.Data;
voltage5 = sim_out.logsout.get('Battery5_Voltage').Values.Data;

current1 = sim_out.logsout.get('Battery1_Current').Values.Data;
current2 = sim_out.logsout.get('Battery2_Current').Values.Data;
current3 = sim_out.logsout.get('Battery3_Current').Values.Data;
current4 = sim_out.logsout.get('Battery4_Current').Values.Data;
current5 = sim_out.logsout.get('Battery5_Current').Values.Data;

grid_voltage = sim_out.logsout.get('Grid_Voltage').Values.Data;
grid_current = sim_out.logsout.get('Grid_Current').Values.Data;

% Calculate the power of each battery
battery_power1 = voltage1 .* current1;
battery_power2 = voltage2 .* current2;
battery_power3 = voltage3 .* current3;
battery_power4 = voltage4 .* current4;
battery_power5 = voltage5 .* current5;

% Calculate the total power of the batteries
total_battery_power = battery_power1 + battery_power2 + battery_power3 + battery_power4 + battery_power5;

% Calculate the power of the grid
grid_power = grid_voltage .* grid_current;

% Plot the energy stored in each battery
figure;
subplot(5,1,1);
plot(battery_energy1);
title('Battery 1 Energy');
xlabel('Time (s)');
ylabel('Energy (Wh)');

subplot(5,1,2);
plot(battery_energy2);
title('Battery 2 Energy');
xlabel('Time (s)');
ylabel('Energy (Wh)');

subplot(5,1,3);
plot(battery_energy3);
title('Battery 3 Energy');
xlabel('Time (s)');
ylabel('Energy (Wh)');

subplot(5,1,4);
plot(battery_energy4);
title('Battery 4 Energy');
xlabel('Time (s)');
ylabel('Energy (Wh)');

subplot(5,1,5);
plot(battery_energy5);
title('Battery 5 Energy');
xlabel('Time (s)');
ylabel('Energy (Wh)');

% Plot the total energy stored in the batteries
figure;
plot(total_battery_energy);
title('Total Battery Energy');
xlabel('Time (s)');
ylabel('Energy (Wh)');

% Plot the energy supplied by the grid
figure;
plot(grid_energy);
title('Grid Energy');
xlabel('Time (s)');
ylabel('Energy (Wh)');

% Plot the results
figure;
subplot(6,1,1);
plot(soc1);
title('Battery 1 SOC');
xlabel('Time (s)');
ylabel('SOC (%)');

subplot(6,1,2);
plot(soc2);
title('Battery 2 SOC');
xlabel('Time (s)');
ylabel('SOC (%)');

subplot(6,1,3);
plot(soc3);
title('Battery 3 SOC');
xlabel('Time (s)');
ylabel('SOC (%)');

subplot(6,1,4);
plot(soc4);
title('Battery 4 SOC');
xlabel('Time (s)');
ylabel('SOC (%)');

subplot(6,1,5);
plot(soc5);
title('Battery 5 SOC');
xlabel('Time (s)');
ylabel('SOC (%)');

subplot(6,1,6);
plot(grid_current);
title('Grid Current');
xlabel('Time (s)');
ylabel('Current (A)');


