"use strict";

const RULESET_VERSION = "1.2.1";
const MAX_FILE_BYTES = 5 * 1024 * 1024;
const PLACEHOLDERS = new Set(["", "n/a", "na", "not applicable", "not available", "unknown", "none", "-", ".", "?", "tbd"]);
const LABELS = {
  _lab_temperature: "Laboratory temperature", _lab_humidity: "Laboratory humidity",
  _milling_device: "Milling device", _extruder_type: "Extruder type", _device_type_other: "Other device type",
  _milling_model: "Device model", _milling_model_year: "Model year", _modifications: "Device modifications",
  _solid_dosing: "Solid dosing", _solid_dosing_device: "Solid dosing device", _liquid_dosing: "Liquid dosing",
  _liquid_dosing_device: "Liquid dosing device", _milling_component_material: "Milling media material",
  _milling_component_steel: "Steel grade", _milling_component_material_other: "Other media material",
  _milling_component_size: "Milling media size", _milling_component_weight: "Milling media total mass",
  _milling_component_count: "Milling media count", _vessel_material: "Vessel material",
  _vessel_material_other: "Other vessel material", _vessel_modifications: "Vessel modifications",
  _vessel_volume: "Vessel volume", _die_used: "Die used", _die_diameter: "Die diameter",
  _milling_frequency: "Milling frequency", _rpm: "Rotation speed", _run_cycles: "Run cycles",
  _pause_cycles: "Pause cycles", _run_duration: "Run duration", _pause_duration: "Pause duration",
  _reverse_mode: "Reverse mode", _reaction_time: "Reaction time", _residence_time: "Residence time",
  _atmosphere: "Atmosphere", _mode: "Operating mode", _reactor_filling_ratio: "Reactor filling ratio",
  _screw_diameter: "Screw diameter", _length_to_diameter_ratio: "Length-to-diameter ratio",
  _screw_configuration: "Screw configuration", _screw_speed: "Screw speed", _solid_feed_rate: "Solid feed rate",
  _liquid_feed_rate: "Liquid feed rate", _temperature_profile: "Temperature profile",
  _production_rate: "Production rate", _space_time_yield: "Space-time yield", _reaction: "Reaction description",
  _additives: "Additive", _additive_physical_state: "Additive physical state", _additive_volume: "Additive amount",
  _catalyst: "Catalyst", _reagent_ratio: "Reagent ratio", _reagent_ratio_type: "Ratio basis",
  _pretreatment: "Pretreatment", _workup_procedure: "Workup procedure", _monitoring_method: "Monitoring method",
  _product_characterization: "Product characterization", _time_after_reaction: "Time before analysis",
  _yield: "Yield", _product_distribution: "Product distribution", _computational_tool: "Computational tool",
  _notes: "Notes"
};

Object.assign(LABELS, {
  _schema_version: "MIF schema version", _experiment_id: "Experiment ID", _parent_experiment_id: "Parent experiment ID",
  _experiment_title: "Experiment title", _experiment_purpose: "Purpose or hypothesis", _experiment_status: "Record status",
  _operator_name: "Operator", _organization: "Organization", _laboratory: "Laboratory", _experiment_start: "Experiment start",
  _experiment_end: "Experiment end", _record_created: "Record creation time", _record_modified: "Record modification time",
  _replicate_number: "Replicate number", _replicate_group: "Replicate group", _source_doi: "Publication DOI", _data_license: "Data license",
  _instrument_id: "Instrument asset ID", _instrument_manufacturer: "Instrument manufacturer", _calibration_date: "Calibration date",
  _calibration_status: "Calibration status", _mill_mechanism: "Mill mechanism", _mill_orientation: "Mill orientation",
  _milling_stations: "Number of milling stations", _station_position: "Station position", _oscillation_amplitude: "Oscillation amplitude",
  _planetary_disk_radius: "Planetary disk radius", _planetary_jar_radius: "Jar orbit radius", _rotation_ratio: "Rotation ratio",
  _vessel_shape: "Vessel internal shape", _vessel_internal_diameter: "Vessel internal diameter", _vessel_internal_length: "Vessel internal length",
  _vessel_empty_mass: "Empty vessel mass", _vessel_liner: "Vessel liner", _vessel_lid: "Vessel lid", _vessel_seal: "Vessel seal",
  _media_size_distribution: "Media size distribution", _media_density: "Media density", _sample_bulk_volume: "Sample bulk volume",
  _sample_bulk_density: "Sample bulk density", _atmosphere_gas_purity: "Atmosphere gas purity", _atmosphere_pressure: "Atmosphere pressure",
  _atmosphere_flow_rate: "Atmosphere flow rate", _atmosphere_preparation: "Atmosphere preparation", _sealing_method: "Sealing method",
  _temperature_control: "Temperature control", _starting_vessel_temperature: "Starting vessel temperature",
  _maximum_vessel_temperature: "Maximum vessel temperature", _final_vessel_temperature: "Final vessel temperature",
  _temperature_measurement_method: "Temperature measurement method", _process_timeline: "Process timeline", _process_segments: "Process segments",
  _sampling_events: "Sampling events", _observations: "Process observations", _endpoint_criterion: "Endpoint criterion",
  _actual_frequency: "Measured frequency", _actual_rpm: "Measured speed", _power_profile: "Power or torque profile",
  _energy_consumption: "Electricity consumption", _specific_energy_input: "Specific energy input", _impact_energy_model: "Impact or energy model",
  _cumulative_energy: "Cumulative mechanical energy", _in_situ_monitoring: "In situ monitoring", _in_situ_instrument: "In situ instrument",
  _in_situ_acquisition: "In situ acquisition parameters", _raw_process_data_uri: "Raw process-data URI", _time_to_vessel_opening: "Time to vessel opening",
  _cooling_procedure: "Cooling procedure", _aging_conditions: "Aging conditions", _storage_conditions: "Product storage conditions",
  _recovered_mass: "Recovered product mass", _material_losses: "Material losses", _mass_balance: "Mass balance", _product_identity: "Product identity",
  _product_identifier: "Product identifier", _yield_type: "Yield basis", _conversion: "Conversion", _selectivity: "Selectivity",
  _purity: "Product purity", _phase_fraction: "Phase fraction", _outcome_uncertainty: "Outcome uncertainty", _replicate_count: "Replicate count",
  _replicate_results: "Replicate results", _result_mean: "Result mean", _result_standard_deviation: "Result standard deviation",
  _contamination_analysis: "Contamination analysis", _wear_observation: "Wear observation", _analysis_sample_id: "Analysis sample ID",
  _analysis_instrument: "Analytical instrument", _analysis_method_parameters: "Analytical method parameters", _analysis_calibration: "Analytical calibration",
  _analysis_software: "Analysis software", _analysis_software_version: "Analysis software version", _raw_data_uri: "Raw-data URI",
  _processed_data_uri: "Processed-data URI", _data_checksum: "Data checksum", _procedure_uri: "Procedure URI", _safety_notes: "Safety notes",
  _deviations: "Deviations", _not_applicable_fields: "Not-applicable declarations", _not_measured_fields: "Not-measured declarations",
  _unknown_fields: "Unknown-value declarations", _below_detection_limit_fields: "Below-detection-limit declarations",
  _process_mass_intensity: "Process mass intensity", _e_factor: "E-factor", _atom_economy: "Atom economy",
  _reaction_mass_efficiency: "Reaction mass efficiency", _waste_mass: "Waste mass", _water_use: "Water use",
  _sustainability_method: "Sustainability method", _energy_source: "Energy source"
});

const SAMPLE_DATA = {
  export_name: "Ball_Mill_3_(supplied-example)",
  _lab_temperature: "N/A", _lab_humidity: "N/A", _milling_device: "Ball Mill",
  _extruder_type: "N/A", _device_type_other: "N/A", _modifications: "N/A", _milling_model: "33",
  _milling_model_year: "N/A", _solid_dosing: "N/A", _solid_dosing_device: "N/A", _liquid_dosing: "N/A",
  _liquid_dosing_device: "N/A", _milling_component_material: "Steel", _milling_component_steel: "N/A",
  _milling_component_material_other: "N/A", _milling_component_size: "3 mm", _milling_component_weight: "3 mg",
  _milling_component_count: "N/A", _vessel_material: "Stainless Steel", _vessel_material_other: "N/A",
  _vessel_modifications: "N/A", _vessel_volume: "3 mL", _die_used: "N/A", _die_diameter: "N/A",
  _milling_frequency: "3 Hz", _rpm: "N/A", _run_cycles: "N/A", _pause_cycles: "N/A",
  _run_duration: "N/A", _pause_duration: "N/A", _reverse_mode: "N/A", _reaction_time: "3 min",
  _residence_time: "N/A", _atmosphere: "3", _mode: "Continuous", _reactor_filling_ratio: "N/A",
  _screw_diameter: "N/A", _length_to_diameter_ratio: "N/A", _screw_configuration: "N/A",
  _screw_speed: "N/A", _solid_feed_rate: "N/A", _liquid_feed_rate: "N/A", _temperature_profile: "N/A",
  _production_rate: "N/A", _space_time_yield: "N/A", _reaction: "3", _additives: "N/A",
  _additive_physical_state: "N/A", _additive_volume: "N/A", _catalyst: "N/A", _reagent_ratio: "N/A",
  _reagent_ratio_type: "molar", _pretreatment: "N/A", _workup_procedure: "N/A",
  _monitoring_method: "N/A", _product_characterization: "N/A", _time_after_reaction: "N/A",
  _yield: "N/A", _product_distribution: "N/A", _computational_tool: "N/A", _notes: "N/A",
  ...Object.fromEntries(Array.from({ length: 6 }, (_, index) => index + 1).flatMap(i => [
    [`_reagent${i}`, "N/A"], [`_reagent${i}_physical_state`, "N/A"],
    [`_reagent${i}_particle_size`, "N/A"], [`_reagent${i}_sample_mass`, "N/A"]
  ]))
};

Object.assign(SAMPLE_DATA, {
  export_name: "test_reaction_x_v3",
  _schema_version: "V3.0.0", _experiment_id: "BAM-MECH-2026-TEST-X", _experiment_title: "Theophylline–benzamide cocrystal test reaction",
  _experiment_purpose: "Demonstrate a publication-ready MIF V3 lifecycle record.", _experiment_status: "Completed", _operator_name: "Example Researcher",
  _organization: "Example Mechanochemistry Laboratory", _laboratory: "Lab M-01", _experiment_start: "2026-09-29T09:00:00+02:00",
  _experiment_end: "2026-09-29T09:42:00+02:00", _record_created: "2026-09-29T10:00:00+02:00", _record_modified: "2026-09-29T10:30:00+02:00",
  _replicate_number: "1", _replicate_group: "THEO-BZA-01", _data_license: "CC BY 4.0", _milling_device: "Ball Mill",
  _milling_model: "Retsch MM 400", _milling_model_year: "2024", _instrument_id: "MM400-EXAMPLE-01", _instrument_manufacturer: "Retsch",
  _calibration_date: "2026-08-15", _calibration_status: "Current", _mill_mechanism: "Oscillatory impact and shear", _mill_orientation: "Horizontal",
  _milling_stations: "2", _station_position: "left station", _oscillation_amplitude: "20 mm", _vessel_material: "Stainless Steel",
  _vessel_volume: "15 mL", _vessel_shape: "cylindrical with rounded ends", _vessel_internal_diameter: "22 mm", _vessel_internal_length: "45 mm",
  _vessel_empty_mass: "82.4 g", _vessel_lid: "screw cap", _vessel_seal: "PTFE gasket", _milling_component_material: "Steel",
  _milling_component_steel: "440C", _milling_component_size: "10 mm", _milling_component_weight: "7.0 g", _milling_component_count: "2",
  _media_size_distribution: "2 × 10 mm", _media_density: "7.7 g/cm3", _milling_frequency: "30 Hz", _actual_frequency: "29.9 Hz",
  _reaction_time: "30 min", _mode: "Continuous", _atmosphere: "Dry nitrogen", _atmosphere_gas_purity: "99.999 %",
  _atmosphere_pressure: "1.05 bar", _atmosphere_preparation: "Three evacuation and nitrogen purge cycles", _sealing_method: "PTFE-gasketed screw cap",
  _lab_temperature: "22 °C", _lab_humidity: "42 %", _starting_vessel_temperature: "22 °C", _maximum_vessel_temperature: "38 °C",
  _final_vessel_temperature: "34 °C", _temperature_measurement_method: "Calibrated external IR measurement immediately after stopping",
  _temperature_control: "Passive; no active cooling", _reaction: "1:1 theophylline–benzamide cocrystallization", _reagent_ratio: "1:1",
  _reagent_ratio_type: "molar", _pretreatment: "Both solids dried under vacuum at 60 °C for 16 h", _reagent1: "Theophylline",
  _reagent1_physical_state: "Solid", _reagent1_particle_size: "45–90 µm", _reagent1_sample_mass: "180.2 mg", _reagent1_role: "reactant",
  _reagent1_cas: "58-55-9", _reagent1_smiles: "CN1C(=O)N(C)c2[nH]cnc2C1=O", _reagent1_supplier: "Sigma-Aldrich",
  _reagent1_catalog_number: "T1633", _reagent1_lot_number: "EXAMPLE-T01", _reagent1_purity: "≥99 %", _reagent1_water_content: "0.12 % by KF",
  _reagent1_solid_form: "anhydrous form II", _reagent1_particle_size_method: "sieved", _reagent1_preparation: "vacuum dried", _reagent1_storage: "desiccator",
  _reagent2: "Benzamide", _reagent2_physical_state: "Solid", _reagent2_particle_size: "45–90 µm", _reagent2_sample_mass: "121.1 mg",
  _reagent2_role: "reactant", _reagent2_cas: "55-21-0", _reagent2_smiles: "NC(=O)c1ccccc1", _reagent2_supplier: "TCI",
  _reagent2_catalog_number: "B0108", _reagent2_lot_number: "EXAMPLE-B01", _reagent2_purity: ">99 %", _reagent2_water_content: "0.08 % by KF",
  _reagent2_solid_form: "form I", _reagent2_particle_size_method: "sieved", _reagent2_preparation: "vacuum dried", _reagent2_storage: "desiccator",
  _additives: "Ethanol", _additive_physical_state: "Liquid", _additive_volume: "60 µL", _process_timeline: "00:00 charge and seal; 00:03 start 30 Hz; 00:33 stop; 00:38 open vessel",
  _process_segments: "1 × 30 min at 30 Hz", _observations: "Free-flowing powder before run; slight caking after run; no leakage or abnormal noise.",
  _endpoint_criterion: "Fixed 30 min process followed by PXRD endpoint", _energy_consumption: "18 Wh", _specific_energy_input: "0.064 kWh/kg",
  _time_to_vessel_opening: "5 min", _cooling_procedure: "Cooled closed at ambient temperature for 5 min", _storage_conditions: "Sealed amber vial in desiccator",
  _workup_procedure: "Product recovered by PTFE spatula without washing and dried under vacuum for 1 h", _recovered_mass: "289.4 mg",
  _material_losses: "11.9 mg estimated as vessel and spatula holdup", _mass_balance: "96.1 %", _product_identity: "Theophylline–benzamide 1:1 cocrystal",
  _product_identifier: "internal sample THEO-BZA-01-R1", _yield: "94.8 %", _yield_type: "Isolated yield", _product_distribution: "Single crystalline phase by PXRD",
  _product_characterization: "PXRD, DSC, FTIR", _monitoring_method: "Endpoint PXRD", _time_after_reaction: "2 h", _analysis_sample_id: "THEO-BZA-01-R1-PXRD",
  _analysis_instrument: "Bruker D8 Advance; asset XRD-01", _analysis_method_parameters: "Cu Kα; 5–40° 2θ; 0.02° step; 0.5 s/step",
  _analysis_calibration: "NIST SRM 640f checked 2026-09-20", _analysis_software: "DIFFRAC.EVA", _analysis_software_version: "7.1",
  _raw_data_uri: "supplementary-data/test_reaction_x/raw/", _processed_data_uri: "supplementary-data/test_reaction_x/processed/",
  _data_checksum: "SHA-256: example-placeholder-replace-before-publication", _procedure_uri: "supplementary-data/test_reaction_x/procedure.json",
  _outcome_uncertainty: "±1.8 % (1 SD)", _replicate_count: "3", _replicate_results: "93.1 %, 94.8 %, 96.0 %", _result_mean: "94.6 %",
  _result_standard_deviation: "1.5 %", _contamination_analysis: "ICP-OES: Fe below 25 mg/kg reporting limit", _wear_observation: "No visible scoring or discoloration",
  _safety_notes: "Use dust control and eye protection; confirm vessel pressure compatibility; no unusual hazards observed.", _deviations: "No deviations observed",
  _not_applicable_fields: "_in_situ_monitoring: endpoint-only study; _aging_conditions: no post-milling aging", _not_measured_fields: "_cumulative_energy: collision model not calibrated",
  _process_mass_intensity: "1.18", _e_factor: "0.18", _atom_economy: "100 %", _reaction_mass_efficiency: "94.6 %", _waste_mass: "0.054 g",
  _water_use: "0 mL", _sustainability_method: "Batch boundary from charged materials through isolated dry product; equipment manufacture excluded", _energy_source: "German grid mix, 2026 assumption",
  _notes: "Example data for software testing; identifiers and checksums marked example must be replaced before publication."
});

const state = { file: null, activeSeverity: "all", activeCategory: "all", search: "", result: null };
const $ = id => document.getElementById(id);

function isPresent(value) {
  if (value === undefined || value === null) return false;
  return !PLACEHOLDERS.has(String(value).trim().toLowerCase());
}

function normalized(value) {
  return String(value ?? "")
    .trim().toLowerCase().replace(/[µμ]/g, "u").replace(/\s+/g, " ")
    .replace(/\s+(?=(mg|g|kg|ml|ul|hz|rpm|min|h|°c|c|%)(\b|$))/g, " ");
}

function cleanKey(key) {
  if (key === "export_name") return key;
  return key.startsWith("_") ? key : `_${key}`;
}

function labelFor(key) {
  if (LABELS[key]) return LABELS[key];
  const match = key.match(/^_reagent(\d+)(.*)$/);
  if (match) {
    const suffix = { "": "identity", "_physical_state": "physical state", "_particle_size": "particle size or size fraction", "_sample_mass": "sample mass", "_purification": "purification or use-as-received status", "_preparation": "preparation or pretreatment" }[match[2]] || match[2].replaceAll("_", " ").trim();
    return `Reagent ${match[1]} ${suffix}`;
  }
  return key.replace(/^_/, "").replaceAll("_", " ").replace(/\b\w/g, c => c.toUpperCase());
}

function parseMif(text) {
  const data = {};
  const errors = [];
  text.split(/\r?\n/).forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const match = trimmed.match(/^(_[A-Za-z0-9_]+)\s+(?:"((?:[^"\\]|\\.)*)"|(.*))$/);
    if (!match) {
      errors.push(`Line ${index + 1} could not be parsed.`);
      return;
    }
    const value = match[2] !== undefined ? match[2].replace(/\\"/g, '"').replace(/\\n/g, "\n").replace(/\\\\/g, "\\") : match[3].trim();
    if (Object.hasOwn(data, match[1])) errors.push(`Line ${index + 1} repeats ${match[1]}.`);
    data[match[1]] = value;
  });
  if (!Object.keys(data).length) throw new Error("No MIF data fields were found.");
  return { data, errors };
}

function parseJson(text) {
  const parsed = JSON.parse(text);
  if (!parsed || Array.isArray(parsed) || typeof parsed !== "object") throw new Error("The JSON root must be an object.");
  const data = {};
  Object.entries(parsed).forEach(([key, value]) => {
    if (typeof value === "object" && value !== null) return;
    data[cleanKey(key)] = value == null ? "" : String(value);
  });
  if (!Object.keys(data).some(key => key.startsWith("_"))) throw new Error("No MIF-style fields were found in the JSON object.");
  return { data, errors: [] };
}

function numeric(value) {
  if (!isPresent(value)) return null;
  const match = String(value).replace(",", ".").match(/[-+]?\d*\.?\d+(?:[eE][-+]?\d+)?/);
  return match ? Number(match[0]) : NaN;
}

function toMg(value) {
  const n = numeric(value);
  if (!Number.isFinite(n)) return null;
  const unit = normalized(value);
  if (/\bkg\b/.test(unit)) return n * 1e6;
  if (/\bg\b/.test(unit) && !/\bmg\b/.test(unit)) return n * 1000;
  return n;
}

function toMicroliter(value) {
  const n = numeric(value);
  if (!Number.isFinite(n)) return null;
  return /\bml\b/i.test(String(value)) ? n * 1000 : n;
}

// Locations follow the visible MIF Generator V3.0.7 workflow, including its
// embedded detail panels. The MIF export's older comment headings differ.
const GENERATOR_SECTIONS = [
  ["1. Lab Environment", "_lab_temperature _lab_humidity _atmosphere_gas_purity _atmosphere_pressure _atmosphere_flow_rate _atmosphere_preparation _sealing_method _temperature_control _starting_vessel_temperature _maximum_vessel_temperature _final_vessel_temperature _temperature_measurement_method"],
  ["2. Equipment", "_milling_device _extruder_type _device_type_other _modifications _milling_model _milling_model_year _solid_dosing _solid_dosing_device _liquid_dosing _liquid_dosing_device _instrument_id _instrument_manufacturer _calibration_date _calibration_status _mill_mechanism _mill_orientation _milling_stations _station_position _oscillation_amplitude _planetary_disk_radius _planetary_jar_radius _rotation_ratio _vessel_shape _vessel_internal_diameter _vessel_internal_length _vessel_empty_mass _vessel_liner _vessel_lid _vessel_seal _media_size_distribution _media_density _sample_bulk_volume _sample_bulk_density"],
  ["3. Vessels", "_vessel_material _vessel_material_other _vessel_modifications _vessel_volume _die_used _die_diameter"],
  ["4. Milling Balls / Screws", "_milling_component_material _milling_component_steel _milling_component_material_other _milling_component_size _milling_component_weight _milling_component_count _screw_diameter _length_to_diameter_ratio _screw_configuration"],
  ["5. Materials and Reaction Setup", "_reaction _additives _additive_physical_state _additive_volume _catalyst _reagent_ratio _reagent_ratio_type _pretreatment"],
  ["6. Process Parameters", "_milling_frequency _rpm _run_cycles _pause_cycles _run_duration _pause_duration _reverse_mode _reaction_time _residence_time _atmosphere _mode _reactor_filling_ratio _screw_speed _solid_feed_rate _liquid_feed_rate _temperature_profile _production_rate _space_time_yield _process_timeline _process_segments _sampling_events _observations _endpoint_criterion _actual_frequency _actual_rpm _power_profile _energy_consumption _specific_energy_input _impact_energy_model _cumulative_energy _in_situ_monitoring _in_situ_instrument _in_situ_acquisition _raw_process_data_uri"],
  ["7. Workup", "_workup_procedure _time_to_vessel_opening _cooling_procedure _aging_conditions _storage_conditions _recovered_mass _material_losses _mass_balance _product_identity _product_identifier _yield_type _conversion _selectivity _purity _phase_fraction _outcome_uncertainty _replicate_count _replicate_results _result_mean _result_standard_deviation _contamination_analysis _wear_observation"],
  ["8. Analysis, Results and Interpretation", "_monitoring_method _product_characterization _time_after_reaction _yield _product_distribution _computational_tool _notes _analysis_sample_id _analysis_instrument _analysis_method_parameters _analysis_calibration _analysis_software _analysis_software_version _raw_data_uri _processed_data_uri _data_checksum _procedure_uri _safety_notes _deviations _not_applicable_fields _not_measured_fields _unknown_fields _below_detection_limit_fields"],
  ["9. Record and Provenance", "_schema_version _experiment_id _parent_experiment_id _experiment_title _experiment_purpose _experiment_status _operator_name _organization _laboratory _experiment_start _experiment_end _record_created _record_modified _replicate_number _replicate_group _source_doi _data_license"],
  ["10. Sustainability Metrics", "_process_mass_intensity _e_factor _atom_economy _reaction_mass_efficiency _waste_mass _water_use _sustainability_method _energy_source"],
  ["11. Automatically Derived Values", "_derived_total_solid_mass _derived_ball_to_powder_ratio _derived_lag_eta _derived_media_to_vessel_ratio _derived_mass_recovery _unreported_fields"]
];
const GENERATOR_LOCATION = Object.fromEntries(GENERATOR_SECTIONS.flatMap(([section, keys]) => keys.split(" ").map(key => [key, section])));

function generatorSectionFor(field) {
  if (!field) return "MIF file syntax";
  if (/^_reagent\d+(?:_|$)/.test(field)) return "5. Materials and Reaction Setup";
  return GENERATOR_LOCATION[field] || "MIF field outside the current generator";
}

function addAlert(list, severity, code, category, field, title, detail, fix, source = "validation") {
  list.push({ severity, code, category, field, generatorSection: generatorSectionFor(field), title, detail, fix, source });
}

function requireField(data, alerts, field, severity, code, category, reason, fix) {
  if (!isPresent(data[field])) addAlert(alerts, severity, code, category, field, `${labelFor(field)} is missing`, reason, fix);
}

function validateUnit(data, alerts, field, units, code, severity = "C") {
  if (!isPresent(data[field])) return;
  const value = String(data[field]);
  if (!Number.isFinite(numeric(value))) {
    addAlert(alerts, severity, code, "Data quality", field, `${labelFor(field)} is not numeric`, `The value “${value}” cannot be interpreted as a number.`, `Enter a number with its unit, for example ${units[0].example}.`);
    return;
  }
  if (!units.some(unit => unit.pattern.test(value))) {
    addAlert(alerts, "C", `${code}U`, "Data quality", field, `${labelFor(field)} has no recognized unit`, `A number was found, but its unit is absent or does not match the field.`, `Report this value with a recognized unit, for example ${units[0].example}.`);
  }
}

function checkNumber(data, alerts, field, { code, min = -Infinity, max = Infinity, integer = false, severity = "B", label = "permitted range", unit = "" }) {
  if (!isPresent(data[field])) return;
  const value = String(data[field]).trim();
  const number = numeric(value);
  if (!Number.isFinite(number)) {
    if (!alerts.some(alert => alert.field === field && alert.title.endsWith("is not numeric")))
      addAlert(alerts, severity, `${code}N`, "Data quality", field, `${labelFor(field)} is not numeric`, `“${value}” cannot be interpreted as a measured quantity.`, `Report a measured number${unit ? ` in ${unit}` : ""}, or declare the value not measured.`);
    return;
  }
  if (integer && !Number.isInteger(number)) {
    addAlert(alerts, severity, `${code}I`, "Data quality", field, `${labelFor(field)} must be a whole number`, `The reported value is ${value}.`, "Enter the count as a whole number.");
  }
  if (number < min || number > max) {
    const title = min === 0 && max === 100 ? `${labelFor(field)} is outside 0–100%`
      : min === 0 && max === 1 ? `${labelFor(field)} is outside 0–1`
      : min === 0 ? `${labelFor(field)} cannot be negative`
      : min > 0 ? `${labelFor(field)} must be positive`
      : `${labelFor(field)} is outside ${label}`;
    addAlert(alerts, severity, code, "Data quality", field, title, `The reported value is ${value}.`, `Check the measurement and unit${unit ? ` (${unit})` : ""}; correct the MIF field or document a justified exception.`);
  }
}

function checkApparentPercentage(data, alerts, field, code, { requirePercentSign = false } = {}) {
  if (!isPresent(data[field])) return;
  const value = String(data[field]).trim();
  // Yield may be reported as a mass or another quantity; only assess explicit percentages.
  if (requirePercentSign && !value.includes("%")) return;
  const number = numeric(value);
  if (!Number.isFinite(number)) {
    addAlert(alerts, "B", `${code}N`, "Data quality", field, `${labelFor(field)} is not numeric`, `“${value}” cannot be interpreted as a percentage.`, "Report a numeric percentage or declare why it was not measured.");
    return;
  }
  if (number < 0) {
    addAlert(alerts, "B", code, "Data quality", field, `${labelFor(field)} is negative`, `The reported value is ${value}.`, "Check the calculation, value and unit.");
  } else if (number > 150) {
    addAlert(alerts, "B", code, "Data quality", field, `${labelFor(field)} is far above 100%`, `The reported value is ${value}; this large excess needs a corrected calculation or a documented explanation.`, "Check input and recovered masses, material identity, moisture or solvent uptake, and the calculation basis.");
  } else if (number > 110) {
    addAlert(alerts, "C", code, "Data quality", field, `${labelFor(field)} exceeds 110%`, `The reported value is ${value}. The excess may reflect retained solvent, moisture, a changed material composition, or a calculation error.`, "Verify the measured masses and state the calculation basis and any known source of mass gain.");
  } else if (number > 100) {
    addAlert(alerts, "I", code, "Data quality", field, `${labelFor(field)} is slightly above 100%`, `The reported value is ${value}. Small apparent excesses can result from measurement uncertainty or material retained or gained during workup.`, "Check the calculation basis and document a plausible cause or uncertainty if known.");
  }
}

function parsedIsoDate(value) {
  if (!isPresent(value)) return null;
  const text = String(value).trim();
  const match = text.match(/^(\d{4})-(\d{2})-(\d{2})(?:T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:\d{2})?)?$/);
  if (!match) return NaN;
  const [, year, month, day] = match;
  const calendarDate = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
  if (calendarDate.getUTCFullYear() !== Number(year) || calendarDate.getUTCMonth() + 1 !== Number(month) || calendarDate.getUTCDate() !== Number(day)) return NaN;
  const timestamp = Date.parse(text);
  return Number.isFinite(timestamp) ? timestamp : NaN;
}

function validCas(value) {
  const match = String(value || "").trim().match(/^(\d{2,7})-(\d{2})-(\d)$/);
  if (!match) return false;
  const digits = `${match[1]}${match[2]}`.split("").reverse();
  return digits.reduce((sum, digit, index) => sum + Number(digit) * (index + 1), 0) % 10 === Number(match[3]);
}

function validateRecord(data, parserErrors = []) {
  const alerts = [];
  parserErrors.forEach((error, index) => addAlert(alerts, "B", `SYN${String(index + 1).padStart(3, "0")}`, "File integrity", "", "File syntax needs review", error, "Correct or remove the affected line, then export the file again."));

  const device = normalized(data._milling_device);
  const isBall = device === "ball mill";
  const isPlanetary = device === "planetary ball mill";
  const isMill = isBall || isPlanetary;
  const isExtruder = device.includes("extruder");

  requireField(data, alerts, "_milling_device", "A", "DOC001", "Equipment", "The activation method determines which operating and geometry checks apply.", "Specify the device type used for the experiment.");
  requireField(data, alerts, "_milling_model", "A", "DOC002", "Equipment", "Equipment-specific motion and geometry strongly affect energy transfer and reproducibility.", "Give the manufacturer and model, not only an internal number.");
  requireField(data, alerts, "_atmosphere", "A", "DOC003", "Conditions", "Gas composition and pressure can change reactivity, oxidation, moisture uptake, and safety.", "State air or the gas identity, and add pressure or handling method where relevant.");
  requireField(data, alerts, "_mode", "A", "DOC004", "Conditions", "Continuous, cycled, and reverse operation can deliver different energy histories.", "State the operating mode and document cycles where applicable.");
  requireField(data, alerts, "_reaction", "A", "DOC005", "Reaction", "The record needs an identifiable transformation, not only a run number or sample code.", "Name the transformation and intended product or solid-state change.");

  if (isExtruder) requireField(data, alerts, "_residence_time", "A", "EXT001", "Conditions", "Residence time is the effective processing duration in continuous extrusion.", "Report residence time with units.");
  else requireField(data, alerts, "_reaction_time", "A", "TIM001", "Conditions", "Duration is a core component of cumulative mechanical input.", "Report active processing time with units; describe pauses separately.");

  const reactionText = String(data._reaction || "").trim();
  if (isPresent(reactionText) && (/^\d+(\.\d+)?$/.test(reactionText) || reactionText.length < 12)) {
    addAlert(alerts, "A", "DOC006", "Reaction", "_reaction", "Reaction description is not chemically informative", `The value “${reactionText}” is too short to identify the transformation.`, "Name reactants or transformation class and the intended product or phase.");
  }
  const atmosphereText = String(data._atmosphere || "").trim();
  if (isPresent(atmosphereText) && /^\d+(\.\d+)?$/.test(atmosphereText)) {
    addAlert(alerts, "A", "DOC007", "Conditions", "_atmosphere", "Atmosphere is not identified", `The value “${atmosphereText}” gives no gas identity or pressure unit.`, "State the gas (for example air, N₂, Ar) and pressure or preparation method where relevant.");
  }
  const modelText = String(data._milling_model || "").trim();
  if (isPresent(modelText) && /^\d+$/.test(modelText)) {
    addAlert(alerts, "B", "EQP001", "Equipment", "_milling_model", "Device model may be ambiguous", `“${modelText}” looks like an internal identifier rather than a reproducible commercial model.`, "Report manufacturer and full model name, or describe the custom apparatus.");
  }

  if (isMill) {
    requireField(data, alerts, "_vessel_material", "A", "VES001", "Vessel & media", "Vessel composition affects impact, abrasion, contamination, and heat transfer.", "Report the jar or vessel material and any liner.");
    requireField(data, alerts, "_vessel_volume", "A", "VES002", "Vessel & media", "Vessel volume is needed to interpret filling and transfer conditions.", "Report nominal vessel volume in mL.");
    requireField(data, alerts, "_milling_component_material", "A", "MED001", "Vessel & media", "Milling media material controls density, impact, abrasion, and contamination risk.", "Report ball or media material and grade where known.");
    requireField(data, alerts, "_milling_component_size", "A", "MED002", "Vessel & media", "Media diameter or size is required to interpret collision energy and surface area.", "Report media diameter or size distribution in mm.");
    if (!isPresent(data._milling_component_weight) && !isPresent(data._milling_component_count)) {
      addAlert(alerts, "A", "MED003", "Vessel & media", "_milling_component_weight", "Milling media quantity is missing", "Neither total media mass nor media count is reported.", "Report ball count and preferably total ball mass; include individual sizes when mixed media are used.");
    }
    if (isBall) requireField(data, alerts, "_milling_frequency", "A", "OPS001", "Conditions", "Mixer-mill frequency is the primary set-point for mechanical input.", "Report frequency in Hz and, when known, oscillation amplitude.");
    if (isPlanetary) requireField(data, alerts, "_rpm", "A", "OPS002", "Conditions", "Planetary-mill rotation speed is a primary set-point for mechanical input.", "Report rotation speed in rpm, rotation ratio, and direction.");
  }

  if (isExtruder) {
    requireField(data, alerts, "_extruder_type", "A", "EXT002", "Equipment", "Extruder configuration determines transport and mixing.", "Specify single- or twin-screw and manufacturer/model.");
    requireField(data, alerts, "_vessel_material", "B", "EXT003", "Equipment", "Barrel and screw materials affect wear and heat transfer.", "Report barrel and screw materials.");
    requireField(data, alerts, "_screw_diameter", "B", "EXT004", "Equipment", "Screw diameter is required for geometric comparison and scale-up.", "Report screw diameter in mm.");
    requireField(data, alerts, "_length_to_diameter_ratio", "B", "EXT005", "Equipment", "L/D ratio helps define the processing path.", "Report the extruder length-to-diameter ratio.");
    requireField(data, alerts, "_screw_configuration", "B", "EXT006", "Equipment", "Screw elements determine conveying, kneading, and shear.", "Describe the screw element sequence or provide a configuration reference.");
    requireField(data, alerts, "_screw_speed", "A", "EXT007", "Conditions", "Screw speed controls mechanical input and residence behavior.", "Report screw speed in rpm.");
    requireField(data, alerts, "_solid_feed_rate", "A", "EXT008", "Conditions", "Feed rate is needed to reproduce loading and residence time.", "Report solid feed rate with units.");
    requireField(data, alerts, "_temperature_profile", "B", "EXT009", "Conditions", "Barrel-zone temperatures strongly influence the process.", "Report set and measured temperatures by barrel zone.");
  }

  const reagentIds = Array.from({ length: 6 }, (_, i) => i + 1).filter(i => isPresent(data[`_reagent${i}`]));
  if (!reagentIds.length) {
    addAlert(alerts, "A", "REA001", "Reaction", "_reagent1", "No reagents are identified", "The transformation cannot be reproduced or chemically interpreted without its starting materials.", "List each reagent with an unambiguous name or identifier.");
  } else {
    reagentIds.forEach(i => {
      requireField(data, alerts, `_reagent${i}_sample_mass`, "B", `REA1${i}`, "Reaction", "Absolute charge is needed for scale, loading, ratios, and additive calculations.", `Report the amount of reagent ${i} with units.`);
      requireField(data, alerts, `_reagent${i}_physical_state`, "C", `REA2${i}`, "Reaction", "Physical form can affect mixing and reaction kinetics.", `Report the physical state of reagent ${i}; add particle size for solids when relevant.`);
      const reagentName = String(data[`_reagent${i}`]).trim();
      if (/^[A-Z]$/i.test(reagentName)) addAlert(alerts, "B", `REA5${i}`, "Reaction", `_reagent${i}`, `Reagent ${i} is identified only by a letter`, `“${reagentName}” is not a chemical name or resolvable identifier.`, `Give reagent ${i} a chemical name and add a CAS RN, SMILES or InChIKey where known.`);
      if (normalized(data[`_reagent${i}_physical_state`]).includes("solid") && !isPresent(data[`_reagent${i}_particle_size`])) {
        addAlert(alerts, "D", `REA3${i}`, "Reaction", `_reagent${i}_particle_size`, "Solid reagent size or commercial form is not described", "Particle size, size fraction, morphology, or an as-received commercial-powder statement can materially affect mixing and reaction kinetics.", `Describe reagent ${i} with free text, for example “45–90 µm, sieved” or “commercial powder, used as received”.`);
      }
      if (!isPresent(data[`_reagent${i}_purification`]) && !isPresent(data[`_reagent${i}_preparation`])) {
        addAlert(alerts, "D", `REA4${i}`, "Reaction", `_reagent${i}_purification`, "Reagent handling before use is not documented", "Purification, drying, sieving, grinding, or use as received may change material properties relevant to the reaction.", `State the purification or preparation of reagent ${i}, including “used as received” when appropriate.`);
      }
      const size = String(data[`_reagent${i}_particle_size`] || "").trim();
      if (isPresent(size) && /(?:used as received|dry(?:ing|ied)|purif(?:ied|ication)|pre.?treat)/i.test(size) && !/(?:powder|crystal|particle|granule|siev|fraction|mesh|\d\s*(?:µm|μm|um|mm))/i.test(size)) {
        addAlert(alerts, "C", `REA6${i}`, "Material provenance", `_reagent${i}_particle_size`, `Reagent ${i} preparation is in the size field`, `“${size}” describes handling but gives no particle size, size fraction or physical form.`, `Move the handling statement to reagent ${i} purification/preparation and describe the particle form or size here.`);
      } else if (isPresent(size) && /^(?:big|large|small|tiny|fine|coarse)\s+(?:crystals?|particles?|powder)$/i.test(size)) {
        addAlert(alerts, "C", `REA7${i}`, "Material provenance", `_reagent${i}_particle_size`, `Reagent ${i} size description is too qualitative`, `“${size}” does not define a reproducible size fraction.`, "Give an approximate range, sieve fraction, or a supplier grade; retain the morphology description if useful.");
      }
    });
  }
  if (reagentIds.length > 1 && !isPresent(data._reagent_ratio)) {
    addAlert(alerts, "B", "REA002", "Reaction", "_reagent_ratio", "Reagent ratio is missing", "Stoichiometry should be stated explicitly even when individual masses are reported.", "Report the ratio and specify whether it is molar, mass-based, or another basis.");
  }

  const hasAdditive = isPresent(data._additives);
  if (hasAdditive) {
    requireField(data, alerts, "_additive_physical_state", "B", "ADD001", "Additives", "The additive form determines the appropriate quantity and interpretation.", "State whether the additive is liquid, solution, solid, or another form.");
    requireField(data, alerts, "_additive_volume", "B", "ADD002", "Additives", "Additive quantity is needed to distinguish neat grinding, LAG, slurry, or other regimes.", "Report additive volume or mass with units.");
  }

  requireField(data, alerts, "_workup_procedure", "B", "WRK001", "Workup & analysis", "Isolation and handling can change yield, phase, composition, or apparent conversion.", "Describe recovery, washing, drying, separation, and storage, or state explicitly that no workup was used.");
  requireField(data, alerts, "_product_characterization", "B", "ANA001", "Workup & analysis", "A product claim needs a stated analytical basis.", "List the methods used to identify and assess the product, with a data or publication reference where possible.");
  const validOutcomePercent = ["_yield", "_conversion", "_phase_fraction"].some(field => Number.isFinite(numeric(data[field])) && numeric(data[field]) >= 0 && numeric(data[field]) <= 100);
  const usefulDistribution = isPresent(data._product_distribution) && !/^(?:product|products?|mixture)$/i.test(String(data._product_distribution).trim());
  if (!validOutcomePercent && !usefulDistribution) {
    addAlert(alerts, "B", "OUT001", "Outcome", "_yield", "No quantitative outcome is reported", "Neither yield, conversion, phase fraction, nor product distribution is available.", "Report a quantitative outcome and how it was measured; distinguish isolated yield from analytical conversion.");
  }
  if (!isPresent(data._monitoring_method)) {
    addAlert(alerts, "C", "ANA002", "Workup & analysis", "_monitoring_method", "Reaction monitoring is not described", "The record does not show how completion or time-dependent behavior was assessed.", "State the in situ or ex situ monitoring method, or explain that only an endpoint was measured.");
  }
  if (!isPresent(data._time_after_reaction)) {
    addAlert(alerts, "C", "ANA003", "Workup & analysis", "_time_after_reaction", "Analysis timing is missing", "Mechanochemical products can evolve during aging, cooling, or exposure after processing.", "Report the interval and storage conditions between processing and analysis.");
  }

  validateUnit(data, alerts, "_vessel_volume", [{ pattern: /\bml\b/i, example: "15 mL" }], "UNT001", "B");
  validateUnit(data, alerts, "_milling_component_size", [{ pattern: /\bmm\b/i, example: "10 mm" }], "UNT002", "B");
  validateUnit(data, alerts, "_milling_component_weight", [{ pattern: /\b(mg|g|kg)\b/i, example: "3.5 g" }], "UNT003", "B");
  validateUnit(data, alerts, "_milling_frequency", [{ pattern: /\bhz\b/i, example: "30 Hz" }], "UNT004", "B");
  validateUnit(data, alerts, "_reaction_time", [{ pattern: /\b(s|sec|second|seconds|min|minute|minutes|h|hr|hour|hours)\b/i, example: "60 min" }], "UNT005", "B");
  validateUnit(data, alerts, "_residence_time", [{ pattern: /\b(s|sec|second|seconds|min|minute|minutes|h|hr|hour|hours)\b/i, example: "8 min" }], "UNT006", "B");
  validateUnit(data, alerts, "_lab_temperature", [{ pattern: /°?\s*c\b/i, example: "22 °C" }], "UNT007", "C");
  reagentIds.forEach(i => validateUnit(data, alerts, `_reagent${i}_sample_mass`, [{ pattern: /\b(mg|g|kg)\b/i, example: "150 mg" }], `UNT1${i}`, "B"));

  const positiveFields = ["_vessel_volume", "_milling_component_size", "_milling_component_weight", "_milling_component_count", "_milling_frequency", "_rpm", "_reaction_time", "_residence_time", "_screw_speed", "_recovered_mass", "_actual_frequency", "_actual_rpm", "_time_to_vessel_opening", "_replicate_count", "_replicate_number", "_milling_stations", "_oscillation_amplitude", "_vessel_internal_diameter", "_vessel_internal_length", "_vessel_empty_mass", "_screw_diameter", "_length_to_diameter_ratio", "_solid_feed_rate", "_liquid_feed_rate", "_production_rate", "_space_time_yield", "_die_diameter", "_planetary_disk_radius", "_planetary_jar_radius", "_media_density", "_sample_bulk_density", "_sample_bulk_volume"];
  positiveFields.forEach((field, index) => checkNumber(data, alerts, field, { code: `VAL${String(index + 1).padStart(3, "0")}`, min: Number.MIN_VALUE, integer: ["_milling_component_count", "_replicate_count", "_replicate_number", "_milling_stations"].includes(field), label: "the positive range" }));
  reagentIds.forEach(i => checkNumber(data, alerts, `_reagent${i}_sample_mass`, { code: `VAL1${i}`, min: Number.MIN_VALUE, label: "the positive range", unit: "mg, g or kg" }));
  ["_run_cycles", "_pause_cycles", "_run_duration", "_pause_duration", "_energy_consumption", "_specific_energy_input", "_cumulative_energy", "_material_losses", "_result_standard_deviation", "_atmosphere_flow_rate", "_waste_mass", "_water_use", "_process_mass_intensity", "_e_factor"].forEach((field, index) => checkNumber(data, alerts, field, { code: `NON${String(index + 1).padStart(3, "0")}`, min: 0, integer: ["_run_cycles", "_pause_cycles"].includes(field) }));
  ["_lab_humidity", "_yield", "_mass_balance", "_conversion", "_selectivity", "_purity", "_phase_fraction", "_atom_economy", "_reaction_mass_efficiency"].forEach((field, index) => {
    const code = `PCT${String(index + 1).padStart(3, "0")}`;
    if (field === "_yield") checkApparentPercentage(data, alerts, field, code, { requirePercentSign: true });
    else if (field === "_mass_balance") checkApparentPercentage(data, alerts, field, code);
    else checkNumber(data, alerts, field, { code, min: 0, max: 100, unit: "%" });
  });
  if (isPresent(data._reactor_filling_ratio)) checkNumber(data, alerts, "_reactor_filling_ratio", { code: "RAT001", min: 0, max: 1, label: "0–1", unit: "fraction of vessel volume" });
  ["_lab_temperature", "_starting_vessel_temperature", "_maximum_vessel_temperature", "_final_vessel_temperature"].forEach((field, index) => checkNumber(data, alerts, field, { code: `TMP${String(index + 1).padStart(3, "0")}`, min: -273.15, label: "the Celsius physical range", unit: "°C" }));
  if (isPresent(data._reagent_ratio) && /^\s*[-+]?\d+(?:[.,]\d+)?\s*:\s*[-+]?\d+(?:[.,]\d+)?\s*$/.test(String(data._reagent_ratio))) {
    const parts = String(data._reagent_ratio).split(":").map(part => Number(part.trim().replace(",", ".")));
    if (parts.some(part => part <= 0)) addAlert(alerts, "B", "RAT002", "Data quality", "_reagent_ratio", "Reagent ratio contains a nonpositive component", `The reported ratio is ${data._reagent_ratio}.`, "Use positive stoichiometric or mass parts and state the ratio basis.");
  }
  if (hasAdditive) {
    checkNumber(data, alerts, "_additive_volume", { code: "ADD003", min: Number.MIN_VALUE, label: "the positive range", unit: "µL, mL, mg or g" });
    if (Number.isFinite(numeric(data._additive_volume)) && !/(?:^|[^\p{L}])(µl|μl|ul|ml|mg|g)\b/iu.test(String(data._additive_volume))) addAlert(alerts, "B", "ADD004", "Data quality", "_additive_volume", "Additive amount has no volume or mass unit", `The reported value is ${data._additive_volume}.`, "Report a measured liquid volume or solid mass with units.");
  }
  for (const field of ["_atmosphere_gas_purity", ...reagentIds.flatMap(i => [`_reagent${i}_purity`, `_reagent${i}_water_content`])]) {
    if (!isPresent(data[field])) continue;
    if (/%/.test(String(data[field]))) checkNumber(data, alerts, field, { code: `PRC${field.replace(/\D/g, "").padStart(2, "0")}${field.includes("water") ? "W" : "P"}`, min: 0, max: 100, unit: "%" });
    else if (field.endsWith("_purity") && !Number.isFinite(numeric(data[field])) && !/\b(?:acs|reagent|analytical|technical|hplc|lc-ms|pharmaceutical)\s+grade\b/i.test(String(data[field]))) addAlert(alerts, "C", `PUR${field.replace(/\D/g, "").padStart(2, "0")}`, "Data quality", field, `${labelFor(field)} is not quantified`, `“${data[field]}” does not state a grade, assay or measured purity.`, "Report a supplier grade, certificate value or measured purity with its basis.");
  }
  ["_derived_total_solid_mass", "_derived_ball_to_powder_ratio", "_derived_lag_eta"].forEach((field, index) => checkNumber(data, alerts, field, { code: `DRV${String(index + 1).padStart(3, "0")}`, min: index < 2 ? Number.MIN_VALUE : 0, label: "the nonnegative range" }));
  checkNumber(data, alerts, "_derived_media_to_vessel_ratio", { code: "DRV004", min: 0, max: 1, label: "0–1" });
  checkApparentPercentage(data, alerts, "_derived_mass_recovery", "DRV005");

  const dates = Object.fromEntries(["_experiment_start", "_experiment_end", "_record_created", "_record_modified", "_calibration_date"].map(field => [field, parsedIsoDate(data[field])]));
  Object.entries(dates).forEach(([field, timestamp], index) => {
    if (Number.isNaN(timestamp)) addAlert(alerts, "B", `DAT${String(index + 1).padStart(3, "0")}`, "Data quality", field, `${labelFor(field)} is not an ISO date`, `“${data[field]}” is not a valid calendar date or timestamp.`, "Use YYYY-MM-DD for calibration or an ISO date and time for an experiment event.");
  });
  const now = Date.now();
  if (Number.isFinite(dates._calibration_date) && dates._calibration_date > now) addAlert(alerts, "B", "DAT006", "Internal consistency", "_calibration_date", "Last calibration date is in the future", `The reported date is ${data._calibration_date}.`, "Correct the date or identify it as a scheduled calibration outside the last-calibration field.");
  for (const field of ["_record_created", "_record_modified"]) if (Number.isFinite(dates[field]) && dates[field] > now) addAlert(alerts, "B", `DAT${field === "_record_created" ? "012" : "013"}`, "Internal consistency", field, `${labelFor(field)} is in the future`, `The reported timestamp is ${data[field]}.`, "Correct the timestamp or leave it undeclared until the event occurs.");
  if (normalized(data._experiment_status) === "completed" && Number.isFinite(dates._experiment_start) && dates._experiment_start > now) addAlert(alerts, "B", "DAT007", "Internal consistency", "_experiment_start", "Completed experiment starts in the future", `The reported start is ${data._experiment_start}.`, "Correct the date or record status.");
  if (normalized(data._experiment_status) === "completed" && Number.isFinite(dates._experiment_end) && dates._experiment_end > now) addAlert(alerts, "B", "DAT014", "Internal consistency", "_experiment_end", "Completed experiment ends in the future", `The reported end is ${data._experiment_end}.`, "Correct the date or record status.");
  if (Number.isFinite(dates._experiment_start) && Number.isFinite(dates._experiment_end) && dates._experiment_end < dates._experiment_start) addAlert(alerts, "B", "DAT008", "Internal consistency", "_experiment_end", "Experiment ends before it starts", "The end timestamp precedes the start timestamp.", "Check the dates, times and time zones.");
  if (Number.isFinite(dates._record_created) && Number.isFinite(dates._record_modified) && dates._record_modified < dates._record_created) addAlert(alerts, "C", "DAT009", "Internal consistency", "_record_modified", "Record modification precedes creation", "The modified timestamp is earlier than the created timestamp.", "Correct the record timestamps.");
  if (Number.isFinite(dates._calibration_date) && Number.isFinite(dates._experiment_start) && dates._calibration_date > dates._experiment_start) addAlert(alerts, "B", "DAT010", "Internal consistency", "_calibration_date", "Calibration postdates the experiment", "A later calibration cannot establish the instrument status during this run.", "Verify the historical calibration date and status for this experiment.");
  if (Number.isFinite(dates._calibration_date) && dates._calibration_date > now && normalized(data._calibration_status) === "overdue") addAlert(alerts, "C", "DAT011", "Internal consistency", "_calibration_status", "Calibration status contradicts its date", "The record says overdue, but the stated last-calibration date is in the future.", "Correct both fields against instrument records.");
  if (isPresent(data._calibration_status) && normalized(data._calibration_status) === "overdue") addAlert(alerts, "C", "MET002", "Equipment", "_calibration_status", "Instrument was marked overdue", "The record does not establish that measured settings were in calibration for this experiment.", "Check maintenance records and report any verification performed before this run.");
  if (isPresent(data._milling_model_year)) {
    const year = numeric(data._milling_model_year);
    if (!Number.isInteger(year) || year < 1900 || year > new Date().getFullYear()) addAlert(alerts, "C", "EQP002", "Data quality", "_milling_model_year", "Manufacture year needs verification", `The reported year is ${data._milling_model_year}.`, "Enter the equipment manufacture year, or leave it unknown if it cannot be verified.");
  }
  if (isPresent(data._time_after_reaction) && !/^(?:immediately|at once)$/i.test(String(data._time_after_reaction).trim()) && (!Number.isFinite(numeric(data._time_after_reaction)) || !/\b(s|sec|seconds?|min|minutes?|h|hr|hours?|days?)\b/i.test(String(data._time_after_reaction)))) addAlert(alerts, "C", "ANA004", "Data quality", "_time_after_reaction", "Analysis timing is not measurable", `“${data._time_after_reaction}” gives no time interval.`, "Report a measured interval, such as 2 h, or state immediately.");
  if (isPresent(data._monitoring_method) && /^(?:looked|seemed|appeared)\s+(?:okay|ok|fine|normal)$/i.test(String(data._monitoring_method).trim())) addAlert(alerts, "C", "ANA005", "Data quality", "_monitoring_method", "Monitoring method is only an impression", `“${data._monitoring_method}” does not name an observation or analytical method.`, "Name the endpoint or in situ technique, or state that the process was not monitored.");
  if (isPresent(data._product_distribution) && /^(?:product|products?|mixture)$/i.test(String(data._product_distribution).trim())) addAlert(alerts, "C", "OUT103", "Data quality", "_product_distribution", "Product distribution is not described", `“${data._product_distribution}” gives no fraction, phase or composition.`, "Describe the observed phases or products and their analytical basis.");
  if (isPresent(data._experiment_title) && /^(?:run|sample|test|trial)\s*\d+$/i.test(String(data._experiment_title).trim())) addAlert(alerts, "C", "PRV006", "Data quality", "_experiment_title", "Experiment title is only a run number", `“${data._experiment_title}” does not identify the reaction or material.`, "Add a concise chemical or process description; keep the run number in the experiment ID.");
  if (isPresent(data._experiment_purpose) && /^(?:see|check)\s+(?:notebook|notes|later)$/i.test(String(data._experiment_purpose).trim())) addAlert(alerts, "C", "PRV007", "Data quality", "_experiment_purpose", "Purpose points to an unavailable note", `“${data._experiment_purpose}” does not describe the experiment aim.`, "State the test objective or hypothesis here, or provide a traceable notebook reference.");
  if (numeric(data._milling_component_count) === 0 && numeric(data._milling_component_weight) > 0) addAlert(alerts, "B", "CON004", "Internal consistency", "_milling_component_count", "Media count conflicts with media mass", "Zero balls are listed but a positive milling-media mass is reported.", "Correct the ball count or explain what the reported media mass represents.");
  if (Number.isFinite(numeric(data._starting_vessel_temperature)) && Number.isFinite(numeric(data._maximum_vessel_temperature)) && numeric(data._maximum_vessel_temperature) < numeric(data._starting_vessel_temperature)) addAlert(alerts, "C", "TMP101", "Internal consistency", "_maximum_vessel_temperature", "Maximum vessel temperature is below its starting value", "The reported maximum cannot be below a measured start temperature for the same interval.", "Check the temperature values and measurement times.");
  if (Number.isFinite(numeric(data._final_vessel_temperature)) && Number.isFinite(numeric(data._maximum_vessel_temperature)) && numeric(data._maximum_vessel_temperature) < numeric(data._final_vessel_temperature)) addAlert(alerts, "C", "TMP102", "Internal consistency", "_maximum_vessel_temperature", "Maximum vessel temperature is below its final value", "The final measurement exceeds the stated maximum.", "Check the temperature values and measurement times.");
  if (Number.isFinite(numeric(data._sample_bulk_volume)) && Number.isFinite(numeric(data._vessel_volume)) && numeric(data._sample_bulk_volume) > numeric(data._vessel_volume)) addAlert(alerts, "B", "GEO005", "Internal consistency", "_sample_bulk_volume", "Sample bulk volume exceeds vessel volume", "The sample cannot fit inside the stated vessel without additional handling or a different unit.", "Verify the bulk volume, nominal vessel volume and units.");

  if (isBall && isPresent(data._rpm)) addAlert(alerts, "C", "CON001", "Internal consistency", "_rpm", "Both frequency and rpm are reported for a mixer mill", "These set-points are not generally interchangeable without device geometry.", "Confirm which value controls the device; retain the other only with a clear explanation.");
  if (isPlanetary && isPresent(data._milling_frequency)) addAlert(alerts, "C", "CON002", "Internal consistency", "_milling_frequency", "Both rpm and frequency are reported for a planetary mill", "The meaning of frequency is unclear for the selected device type.", "Confirm the operating variable and label any secondary frequency explicitly.");
  if (normalized(data._mode).includes("cycle") && (!isPresent(data._run_duration) || !isPresent(data._pause_duration))) {
    addAlert(alerts, "B", "CON003", "Conditions", "_mode", "Cycled operation lacks timing details", "Run and pause intervals are required to reconstruct the thermal and mechanical history.", "Report run duration, pause duration, and number of cycles.");
  }

  const solidReagentIds = reagentIds.filter(i => normalized(data[`_reagent${i}_physical_state`]).includes("solid"));
  const solidMasses = solidReagentIds.map(i => data[`_reagent${i}_sample_mass`]);
  const hasValidSolidMasses = solidMasses.length > 0 && reagentIds.every(i => isPresent(data[`_reagent${i}_physical_state`])) && solidMasses.every(value => /\b(mg|g|kg)\b/i.test(String(value)) && toMg(value) > 0);
  const totalSolidMg = hasValidSolidMasses ? solidMasses.reduce((sum, value) => sum + toMg(value), 0) : 0;
  const mediaMg = toMg(data._milling_component_weight);
  if (totalSolidMg > 0 && Number.isFinite(toMg(data._derived_total_solid_mass)) && Math.abs(toMg(data._derived_total_solid_mass) - totalSolidMg) > Math.max(0.5, totalSolidMg * 0.01)) addAlert(alerts, "B", "DRV007", "Derived checks", "_derived_total_solid_mass", "Derived solid mass disagrees with reagent charges", `The charges total ${totalSolidMg.toFixed(2)} mg, but the export reports ${data._derived_total_solid_mass}.`, "Correct the reagent masses, then regenerate the derived values.");
  if (isMill && totalSolidMg > 0 && mediaMg > 0) {
    const bpr = mediaMg / totalSolidMg;
    if (Number.isFinite(numeric(data._derived_ball_to_powder_ratio)) && Math.abs(numeric(data._derived_ball_to_powder_ratio) - bpr) > Math.max(0.05, bpr * 0.02)) addAlert(alerts, "B", "DRV008", "Derived checks", "_derived_ball_to_powder_ratio", "Derived ball-to-powder ratio disagrees with charges", `The measured masses imply ${bpr.toFixed(2)}:1, but the export reports ${data._derived_ball_to_powder_ratio}.`, "Correct the primary masses and regenerate the MIF export.");
    if (bpr < 1 || bpr > 100) addAlert(alerts, "C", "DER001", "Derived checks", "_milling_component_weight", "Ball-to-powder mass ratio is unusual", `The values imply a ball-to-powder ratio of ${bpr.toFixed(2)}:1. This may be intentional, but it merits confirmation.`, "Verify media and reagent mass units, then state the ratio explicitly in the notes.");
  } else if (isMill) {
    addAlert(alerts, "D", "DER002", "Derived checks", "_milling_component_weight", "Ball-to-powder ratio cannot be calculated", "Media mass or reagent charge data are incomplete.", "Report total media mass and all solid reagent masses so the ratio can be calculated.");
  }

  if (hasAdditive && normalized(data._additive_physical_state).includes("liquid") && totalSolidMg > 0) {
    const liquidUl = toMicroliter(data._additive_volume);
    if (liquidUl !== null) {
      const eta = liquidUl / totalSolidMg;
      if (eta > 2) addAlert(alerts, "C", "DER003", "Derived checks", "_additive_volume", "Liquid loading is above the usual LAG range", `The reported values imply η ≈ ${eta.toFixed(2)} µL mg⁻¹, which is more consistent with a slurry or solution-like regime than conventional LAG.`, "Verify quantities and describe the regime accurately; report η explicitly.");
      else addAlert(alerts, "I", "DER004", "Derived checks", "_additive_volume", "Derived liquid-assisted grinding parameter", `The reported values imply η ≈ ${eta.toFixed(2)} µL mg⁻¹.`, "Include η in the experimental description to support comparison across scales.");
    }
  }

  if (!isPresent(data._lab_temperature)) addAlert(alerts, "D", "CTX001", "Environment", "_lab_temperature", "Ambient temperature is not reported", "Temperature can drift during milling and may influence kinetics or phase behavior.", "Report starting ambient temperature and, if possible, vessel or product temperature after processing.");
  if (!isPresent(data._lab_humidity)) addAlert(alerts, "D", "CTX002", "Environment", "_lab_humidity", "Ambient humidity is not reported", "Moisture can act as an uncontrolled liquid additive for hygroscopic materials.", "Report relative humidity or document dry-box or controlled-atmosphere handling.");
  if (normalized(data._milling_component_material) === "steel" && !isPresent(data._milling_component_steel)) addAlert(alerts, "C", "MED004", "Vessel & media", "_milling_component_steel", "Steel grade is unspecified", "Different steel grades vary in density, hardness, corrosion, and contamination behavior.", "Report the steel grade, for example 440C or stainless steel grade.");
  if (!isPresent(data._pretreatment)) addAlert(alerts, "D", "REA003", "Reaction", "_pretreatment", "Reagent pretreatment is not documented", "Drying, sieving, grinding, storage, and particle size can affect solid-state reactions.", "State relevant pretreatment or explicitly report that none was used.");
  if (!isPresent(data._notes)) addAlert(alerts, "D", "DOC010", "Documentation", "_notes", "No contextual notes are supplied", "The structured fields may not capture unusual observations, hazards, or deviations.", "Add observations or explicitly state that there were no deviations.");

  const isV3 = /^v?3(?:\.|$)/i.test(String(data._schema_version || "").trim());
  if (!isV3) {
    addAlert(alerts, "I", "SCH001", "Schema", "_schema_version", "Legacy or undeclared MIF schema", "The record can still be validated, but it does not declare MIF V3 lifecycle fields.", "Open the file in Mechanochemical Reaction Reporter V3.0.6 or later and add lifecycle metadata where available.");
  } else {
    [
      ["_experiment_id", "A", "PRV001", "Give every run a stable, unique experiment identifier."],
      ["_experiment_title", "B", "PRV002", "Add a concise experiment title."],
      ["_operator_name", "B", "PRV003", "Identify the person who performed or supervised the run."],
      ["_organization", "B", "PRV004", "Identify the responsible organization."],
      ["_experiment_start", "B", "PRV005", "Record an ISO-compatible start date and time."],
      ["_record_created", "C", "PRV008", "Record when this MIF entry was created, or explain why that date is unavailable."],
      ["_instrument_id", "B", "EQP100", "Report an asset ID or serial number so the exact machine is traceable."],
      ["_product_identity", "B", "OUT100", "Identify the product or phase supported by the reported evidence."],
      ["_yield_type", "B", "OUT101", "State whether the reported result is isolated yield, assay yield, conversion, phase fraction or recovery."],
      ["_analysis_sample_id", "B", "EVD001", "Link analytical evidence to a traceable sample ID."],
      ["_analysis_method_parameters", "B", "EVD002", "Report the acquisition and processing settings needed to interpret the analytical result."],
      ["_safety_notes", "C", "SAF001", "Document hazards and controls, or state explicitly that no unusual hazards were identified."],
      ["_deviations", "C", "DEV001", "Document deviations and unexpected events, or state explicitly that none occurred."]
    ].forEach(([field, severity, code, fix]) => requireField(data, alerts, field, severity, code, field.startsWith("_experiment") || field.startsWith("_record") || field.includes("operator") || field.includes("organization") ? "Provenance" : field.startsWith("_analysis") ? "Evidence & FAIR" : field.includes("product") || field.includes("yield") ? "Outcome" : field.includes("safety") || field.includes("deviation") ? "Safety & deviations" : field.includes("instrument") ? "Equipment" : "Process history", "This V3 field is part of the minimum lifecycle record needed to trace and reproduce the experiment.", fix));

    if (!isPresent(data._process_timeline)) {
      const detailedTimelineNeeded = isPresent(data._in_situ_monitoring) || isPresent(data._sampling_events) || normalized(data._mode).includes("cycle") || isPresent(data._process_segments);
      addAlert(alerts, detailedTimelineNeeded ? "B" : "D", "PRO001", "Process history", "_process_timeline", detailedTimelineNeeded ? "Process events need a timeline" : "Brief process summary is absent", detailedTimelineNeeded ? "Sampling, cycled operation or in situ monitoring needs an event sequence." : "A short start/stop summary helps readers distinguish active processing from setup and handling.", detailedTimelineNeeded ? "List starts, pauses, samples, setting changes and stops with times." : "For a routine continuous run, a single start/stop sentence is sufficient.");
    }

    reagentIds.forEach(i => {
      const identifiers = [`_reagent${i}_cas`, `_reagent${i}_smiles`, `_reagent${i}_inchi_key`];
      if (!identifiers.some(field => isPresent(data[field]) && (field.endsWith("_cas") ? validCas(data[field]) : true))) addAlert(alerts, "B", `MAT1${i}`, "Material provenance", `_reagent${i}_cas`, `Reagent ${i} has no valid unambiguous identifier`, "Names alone can be ambiguous across salts, solvates and suppliers.", "Add a valid CAS RN, SMILES or InChIKey; describe solid form separately.");
      if (isPresent(data[`_reagent${i}_cas`]) && !validCas(data[`_reagent${i}_cas`])) addAlert(alerts, "B", `MAT5${i}`, "Material provenance", `_reagent${i}_cas`, `Reagent ${i} CAS RN is invalid`, `“${data[`_reagent${i}_cas`]}” has an invalid CAS RN format or check digit.`, "Verify the registry number against the source or use another unambiguous chemical identifier.");
      if (!isPresent(data[`_reagent${i}_supplier`]) || !isPresent(data[`_reagent${i}_lot_number`])) addAlert(alerts, "C", `MAT2${i}`, "Material provenance", `_reagent${i}_supplier`, `Reagent ${i} supplier or lot is incomplete`, "Batch history, impurities and storage can materially affect solid-state reactivity.", "Report supplier and catalog/lot information, or state that the material was synthesized in-house.");
      if (!isPresent(data[`_reagent${i}_purity`])) addAlert(alerts, "C", `MAT3${i}`, "Material provenance", `_reagent${i}_purity`, `Reagent ${i} purity is missing`, "Purity and grade constrain interpretation of conversion and contamination.", "Report purity, grade or an assay result.");
      if (normalized(data[`_reagent${i}_physical_state`]).includes("solid") && !isPresent(data[`_reagent${i}_solid_form`])) addAlert(alerts, "C", `MAT4${i}`, "Material provenance", `_reagent${i}_solid_form`, `Reagent ${i} solid form is not identified`, "Polymorph, hydrate, solvate or amorphous state may affect the reaction.", "State the known solid form and how it was verified, or declare it unknown.");
    });

    if (isMill) {
      requireField(data, alerts, "_vessel_internal_diameter", "C", "GEO001", "Equipment geometry", "Internal dimensions improve transferability beyond nominal jar volume.", "Report the vessel internal diameter and, where relevant, internal length and shape.");
      if (isBall) requireField(data, alerts, "_oscillation_amplitude", "C", "GEO002", "Equipment geometry", "Frequency alone does not define mixer-mill kinematics.", "Report oscillation amplitude or stroke from manufacturer data or measurement.");
      if (isPlanetary) {
        requireField(data, alerts, "_planetary_disk_radius", "C", "GEO003", "Equipment geometry", "Planetary geometry is needed to compare acceleration and impact conditions.", "Report disk and jar orbit radii.");
        requireField(data, alerts, "_rotation_ratio", "C", "GEO004", "Equipment geometry", "Disk-to-jar ratio and direction affect collision trajectories.", "Report signed disk-to-jar rotation ratio.");
      }
      if (!isPresent(data._calibration_status)) addAlert(alerts, "C", "MET001", "Equipment", "_calibration_status", "Instrument calibration status is not stated", "Measured speed, frequency, temperature and time should be traceable to maintained equipment.", "State current, verification-only, overdue, not calibrated or not applicable.");
    }

    if (!isPresent(data._maximum_vessel_temperature) && !isPresent(data._temperature_control)) addAlert(alerts, "C", "TMP100", "Process history", "_maximum_vessel_temperature", "Thermal history is not characterized", "Mechanochemical reactions can self-heat and pause schedules alter their thermal history.", "Report measured maximum temperature or describe temperature control and why measurement was not possible.");
    if (!isPresent(data._observations)) addAlert(alerts, "D", "OBS001", "Process history", "_observations", "During-process observations are absent", "Caking, color change, pressure release, noise or flow changes can explain outcome and deviations.", "Add timestamped observations or explicitly state that no visible deviations occurred.");
    if (!isPresent(data._recovered_mass) && !isPresent(data._mass_balance)) addAlert(alerts, "C", "OUT102", "Outcome", "_recovered_mass", "Recovery and mass balance are not quantified", "Unreported holdup or loss can distort yield and scale comparisons.", "Report recovered mass, mass balance, or a justified reason why it could not be measured.");
    if (numeric(data._replicate_count) > 1 && (!isPresent(data._replicate_results) || !isPresent(data._result_standard_deviation))) addAlert(alerts, "B", "REP001", "Outcome", "_replicate_results", "Replicates lack individual results or dispersion", "A replicate count without underlying results and variability is not enough to assess repeatability.", "Report individual values plus mean and standard deviation or another justified statistic.");
    if (!isPresent(data._raw_data_uri) && !isPresent(data._processed_data_uri)) addAlert(alerts, "C", "FAI001", "Evidence & FAIR", "_raw_data_uri", "No analytical data location is provided", "Readers cannot trace the reported result to deposited or supplementary data.", "Provide a repository DOI/URI, supplementary filename, or an explicit access statement.");
    if (isPresent(data._raw_data_uri) && !isPresent(data._data_checksum)) addAlert(alerts, "D", "FAI002", "Evidence & FAIR", "_data_checksum", "Data checksum is not supplied", "A checksum makes external files fixity-verifiable.", "Add a SHA-256 checksum for archived raw-data packages where practical.");
    if (!["_not_applicable_fields", "_not_measured_fields", "_unknown_fields", "_below_detection_limit_fields"].some(field => isPresent(data[field]))) addAlert(alerts, "D", "MIS001", "Schema", "_not_measured_fields", "Missing-value reasons are not declared", "A bare N/A cannot distinguish not applicable, not measured, unknown and below detection limit.", "Use the V3 declaration fields to list omitted keys and reasons.");
    if (!isPresent(data._contamination_analysis)) addAlert(alerts, "D", "WEA001", "Outcome", "_contamination_analysis", "Wear contamination was not assessed", "Contact materials can transfer Fe, Zr, W, polymer or other contaminants to the product.", "Report the assessment method/result, visible wear, or why contamination testing was not relevant.");
    if (!isPresent(data._process_mass_intensity) && !isPresent(data._e_factor)) addAlert(alerts, "I", "GRN001", "Sustainability", "_process_mass_intensity", "Green metrics are not reported", "PMI, E-factor and energy intensity can support comparison with solution or scaled processes when boundaries are clear.", "For sustainability claims, report at least one mass metric and the calculation boundary.");
    if (!isPresent(data._energy_consumption) && !isPresent(data._specific_energy_input)) addAlert(alerts, "I", "ENE001", "Sustainability", "_energy_consumption", "Measured energy use is not reported", "Nominal set points do not directly quantify electrical or mechanical energy use.", "For scale-up or green-chemistry claims, measure electricity and normalize it to product mass.");
  }

  alerts.sort((a, b) => "ABCDI".indexOf(a.severity) - "ABCDI".indexOf(b.severity) || a.category.localeCompare(b.category));
  return alerts;
}

function scoreAlerts(alerts) {
  const counts = { A: 0, B: 0, C: 0, D: 0, I: 0 };
  alerts.forEach(alert => { if (Object.hasOwn(counts, alert.severity)) counts[alert.severity]++; });
  let score = Math.max(0, 100 - counts.A * 13 - counts.B * 6 - counts.C * 2 - counts.D);
  if (counts.A) score = Math.min(score, 59);
  else if (counts.B) score = Math.min(score, 79);
  return { score, counts };
}

function fieldCoverage(data, fields) {
  if (!fields.length) return 100;
  return Math.round(100 * fields.filter(field => isPresent(data[field])).length / fields.length);
}

function dimensionScores(data, alerts) {
  const completenessFields = ["_milling_device", "_milling_model", "_reaction", "_reaction_time", "_atmosphere", "_vessel_material", "_vessel_volume", "_milling_component_material", "_milling_component_size", "_reagent1", "_reagent1_sample_mass", "_workup_procedure", "_product_characterization", "_product_identity", "_yield_type"];
  const reproducibilityFields = ["_instrument_id", "_calibration_status", "_vessel_internal_diameter", "_milling_frequency", "_rpm", "_oscillation_amplitude", "_rotation_ratio", "_process_timeline", "_maximum_vessel_temperature", "_atmosphere_preparation", "_reagent1_lot_number", "_reagent1_purity"];
  const analyticalFields = ["_analysis_sample_id", "_product_characterization", "_analysis_instrument", "_analysis_method_parameters", "_yield", "_yield_type", "_product_identity", "_outcome_uncertainty", "_replicate_results", "_contamination_analysis"];
  const traceabilityFields = ["_schema_version", "_experiment_id", "_operator_name", "_organization", "_experiment_start", "_record_created", "_source_doi", "_raw_data_uri", "_data_checksum", "_procedure_uri", "_data_license"];
  const consistencyPenalty = alerts.filter(alert => ["Internal consistency", "Data quality", "Derived checks"].includes(alert.category)).reduce((sum, alert) => sum + ({ A: 20, B: 10, C: 4, D: 1, I: 0 }[alert.severity] || 0), 0);
  return {
    completeness: fieldCoverage(data, completenessFields),
    consistency: Math.max(0, 100 - consistencyPenalty),
    reproducibility: fieldCoverage(data, reproducibilityFields),
    analytical_support: fieldCoverage(data, analyticalFields),
    traceability_fairness: fieldCoverage(data, traceabilityFields)
  };
}

function assessStatus(score, counts) {
  if (counts.A) return { label: "Not publication-ready", headline: "Critical information is missing", description: "Resolve every A alert first. The current record cannot yet support credible reproduction.", color: "#ff8484" };
  if (counts.B || score < 80) return { label: "Needs revision", headline: "Important details need attention", description: "The core record is recognizable, but major reporting gaps remain before publication.", color: "#ffb36e" };
  if (counts.C || score < 90) return { label: "Review recommended", headline: "Mostly complete, with points to verify", description: "No major blockers were found. Review outliers and strengthen the remaining context.", color: "#ecd174" };
  return { label: "Ready for review", headline: "Documentation is well prepared", description: "No critical or major reporting gaps were detected by this ruleset.", color: "#37d4c5" };
}

function runValidation() {
  if (!state.file) return;
  const alerts = validateRecord(state.file.data, state.file.errors || []);
  const metrics = scoreAlerts(alerts);
  state.result = { data: state.file.data, alerts, ...metrics, dimensions: dimensionScores(state.file.data, alerts), validatedAt: new Date().toISOString() };
  state.activeSeverity = "all";
  state.activeCategory = "all";
  state.search = "";
  $("searchInput").value = "";
  render();
}

async function handleFiles(files) {
  if (files.length !== 1) {
    window.alert("Choose one MIF file at a time.");
    return;
  }
  const file = files[0];
  if (file.name.split(".").pop().toLowerCase() !== "mif") {
    window.alert(`${file.name} is not a .mif file.`);
    return;
  }
  if (file.size > MAX_FILE_BYTES) {
    window.alert(`${file.name} is larger than 5 MB.`);
    return;
  }
  try {
    const parsed = parseMif(await file.text());
    state.file = { ...parsed, name: file.name, size: file.size };
  } catch (error) {
    window.alert(`${file.name} could not be read: ${error.message}`);
    return;
  }
  renderFiles();
  runValidation();
  $("fileInput").value = "";
}

function renderFiles() {
  const file = state.file;
  if (!file) {
    $("fileList").innerHTML = `<div class="file-slot empty"><span>MIF</span><p>No file loaded</p></div>`;
    return;
  }
  const size = `${Math.max(1, Math.round(file.size / 1024))} KB`;
  $("fileList").innerHTML = `<div class="file-slot loaded"><span>MIF</span><p title="${escapeHtml(file.name)}">${escapeHtml(file.name)}</p><small>${size}</small></div>`;
}

let animatedScoreResult = null;
let scoreAnimationFrame = null;

function alertRingSegments(counts, score) {
  const grades = ["A", "B", "C", "D", "I"].filter(grade => counts[grade] > 0);
  if (!grades.length) return [{ start: 0, end: 360, color: "var(--ready)" }];
  const alertDegrees = Math.min(360, Math.max(12, 360 * (100 - score) / 100));
  const readyDegrees = 360 - alertDegrees;
  const groups = [{ color: "var(--ready)", weight: readyDegrees }].filter(group => group.weight > 0);
  const weights = { A: 13, B: 6, C: 2, D: 1, I: .5 };
  grades.forEach(grade => groups.push({ color: `var(--${grade.toLowerCase()})`, weight: counts[grade] * weights[grade] }));
  const gap = groups.length > 1 ? Math.min(2.5, alertDegrees / (grades.length * 3)) : 0;
  const totalAlertWeight = groups.slice(readyDegrees > 0 ? 1 : 0).reduce((sum, group) => sum + group.weight, 0);
  const segments = [];
  let angle = 0;
  groups.forEach((group, index) => {
    const extent = index === 0 && readyDegrees > 0 ? readyDegrees - gap : (alertDegrees - gap * grades.length) * group.weight / totalAlertWeight;
    const end = angle + extent;
    segments.push({ start: angle, end, color: group.color });
    angle = end;
    if (gap) { segments.push({ start: angle, end: angle + gap, color: "#fff" }); angle += gap; }
  });
  return segments;
}

function alertRingGradient(segments, reveal) {
  const stops = [];
  for (const segment of segments) {
    if (segment.start >= reveal) break;
    const end = Math.min(segment.end, reveal);
    stops.push(`${segment.color} ${segment.start.toFixed(3)}deg ${end.toFixed(3)}deg`);
    if (end < segment.end) break;
  }
  if (reveal < 360) stops.push(`#e0e7e8 ${reveal.toFixed(3)}deg 360deg`);
  return `conic-gradient(from -90deg, ${stops.join(", ")})`;
}

function animateScoreRing(result) {
  if (animatedScoreResult === result) return;
  animatedScoreResult = result;
  if (scoreAnimationFrame !== null) cancelAnimationFrame(scoreAnimationFrame);
  const ring = $("scoreRing");
  const value = $("scoreValue");
  const segments = alertRingSegments(result.counts, result.score);
  ring.title = "Green shows documentation readiness; the remaining segments indicate alert grades.";
  const setProgress = progress => {
    ring.style.setProperty("--ring-gradient", alertRingGradient(segments, progress * 360));
    value.textContent = Math.round(result.score * progress);
  };
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
    setProgress(1);
    scoreAnimationFrame = null;
    return;
  }
  setProgress(0);
  let startTime = null;
  const duration = 850;
  const step = now => {
    if (startTime === null) startTime = now;
    const elapsed = Math.min(1, (now - startTime) / duration);
    setProgress(1 - Math.pow(1 - elapsed, 3));
    scoreAnimationFrame = elapsed < 1 ? requestAnimationFrame(step) : null;
  };
  scoreAnimationFrame = requestAnimationFrame(step);
}

function render() {
  const result = state.result;
  if (!result) return;
  $("emptySummary").classList.add("hidden");
  $("scoreSummary").classList.remove("hidden");
  $("severityGrid").classList.remove("hidden");
  $("qualityGrid").classList.remove("hidden");
  $("reportSection").classList.remove("hidden");
  $("exportButton").disabled = false;
  $("printButton").disabled = false;
  const status = assessStatus(result.score, result.counts);
  animateScoreRing(result);
  $("statusPill").textContent = status.label;
  $("statusPill").dataset.status = status.label === "Ready for review" ? "ready" : "review";
  $("statusPill").style.color = status.color;
  $("statusPill").style.background = `${status.color}22`;
  $("scoreHeadline").textContent = status.headline;
  $("scoreDescription").textContent = status.description;
  Object.entries(result.counts).forEach(([severity, count]) => $(`count${severity}`).textContent = count);
  Object.entries(result.dimensions || {}).forEach(([name, score]) => {
    const element = document.querySelector(`[data-metric="${name}"]`);
    if (!element) return;
    element.style.setProperty("--metric", `${score}%`);
    const value = element.querySelector("strong");
    if (value) value.textContent = `${score}`;
  });
  renderCategories();
  renderAlerts();
  document.querySelectorAll("#filterGroup button").forEach(button => button.classList.toggle("active", button.dataset.filter === state.activeSeverity));
}

function renderCategories() {
  const categories = [...new Set(state.result.alerts.map(alert => alert.category))];
  $("categoryNav").innerHTML = [`<button class="${state.activeCategory === "all" ? "active" : ""}" data-category="all" type="button">All topics</button>`, ...categories.map(category => {
    const count = state.result.alerts.filter(alert => alert.category === category).length;
    return `<button class="${state.activeCategory === category ? "active" : ""}" data-category="${escapeHtml(category)}" type="button">${escapeHtml(category)} · ${count}</button>`;
  })].join("");
}

function getVisibleAlerts() {
  const query = state.search.trim().toLowerCase();
  return state.result.alerts.filter(alert => {
    const severityMatch = state.activeSeverity === "all" || alert.severity === state.activeSeverity;
    const categoryMatch = state.activeCategory === "all" || alert.category === state.activeCategory;
    const searchMatch = !query || `${alert.title} ${alert.detail} ${alert.fix} ${alert.code} ${alert.field} ${alert.generatorSection}`.toLowerCase().includes(query);
    return severityMatch && categoryMatch && searchMatch;
  });
}

function renderAlerts() {
  const alerts = getVisibleAlerts();
  $("noResults").classList.toggle("hidden", alerts.length > 0);
  $("alertsList").innerHTML = alerts.map(alert => `
    <article class="alert-row" data-severity="${alert.severity}">
      <span class="badge ${alert.severity.toLowerCase()}">${alert.severity}</span>
      <div class="alert-main">
        <h3>${escapeHtml(alert.title)} <span class="alert-code">${escapeHtml(alert.code)}</span></h3>
        <span class="alert-location">${alert.field ? `MIF Generator · ${escapeHtml(alert.generatorSection)} · ${escapeHtml(labelFor(alert.field))}` : "MIF file syntax"}</span>
        <p>${escapeHtml(alert.detail)}</p>
      </div>
      <div class="alert-fix"><strong>Recommended action</strong><p>${escapeHtml(alert.fix)}</p></div>
    </article>`).join("");
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#039;", '"': "&quot;" })[char]);
}

function reportData() {
  return {
    report_type: "checkMIF validation report",
    ruleset_version: RULESET_VERSION,
    validated_at: state.result.validatedAt,
    input_file: state.file.name,
    score: state.result.score,
    counts: state.result.counts,
    dimensions: state.result.dimensions,
    alerts: state.result.alerts,
    disclaimer: "Advisory documentation validation; not a verification of chemical truth or experimental safety."
  };
}

function formatTextReport(report) {
  const lines = [
    "checkMIF validation report",
    "==========================",
    `Input file: ${report.input_file}`,
    `Validated: ${report.validated_at}`,
    `Ruleset: ${report.ruleset_version}`,
    `Readiness: ${report.score}/100`,
    `Alerts: A ${report.counts.A}  B ${report.counts.B}  C ${report.counts.C}  D ${report.counts.D}  Info ${report.counts.I}`,
    "",
    "Documentation scores",
    "--------------------",
    ...Object.entries(report.dimensions).map(([name, score]) => `${name.replace(/_/g, " ")}: ${score}/100`),
    "",
    `Findings (${report.alerts.length})`,
    "--------------------"
  ];
  if (!report.alerts.length) lines.push("No findings.");
  report.alerts.forEach((alert, index) => {
    lines.push(
      "",
      `${index + 1}. [${alert.severity === "I" ? "Info" : alert.severity}] ${alert.title} (${alert.code})`,
      `Location: ${alert.field ? `${alert.generatorSection} > ${labelFor(alert.field)} (${alert.field})` : "MIF file syntax"}`,
      `Finding: ${alert.detail}`,
      `Recommended action: ${alert.fix}`
    );
  });
  lines.push("", report.disclaimer, "");
  return lines.join("\n");
}

function downloadReport(content, type, extension) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `checkmif-report-${new Date().toISOString().slice(0, 10)}.${extension}`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function exportReport(format) {
  if (!state.result) return;
  const report = reportData();
  if (format === "json") downloadReport(JSON.stringify(report, null, 2), "application/json", "json");
  if (format === "txt") downloadReport(formatTextReport(report), "text/plain;charset=utf-8", "txt");
}

function closeDialogOnOutsideClick(dialog, event) {
  if (event.target !== dialog) return;
  const bounds = dialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
}

function registerWebMcp() {
  const context = document.modelContext;
  if (!context?.registerTool) return;
  try {
    void Promise.resolve(context.registerTool({
      name: "validate_mechanochemistry_record",
      title: "Validate mechanochemistry record",
      description: "Validate a structured MIF record with the same checkMIF rules used by the visible report.",
      inputSchema: { type: "object", properties: { record: { type: "object", additionalProperties: { type: ["string", "number", "null"] } } }, required: ["record"], additionalProperties: false },
      annotations: { readOnlyHint: true, untrustedContentHint: true },
      execute(input) {
        if (!input || !input.record || typeof input.record !== "object" || Array.isArray(input.record)) throw new Error("record must be a flat object");
        const data = Object.fromEntries(Object.entries(input.record).map(([key, value]) => [cleanKey(key), value == null ? "" : String(value)]));
        const alerts = validateRecord(data);
        const metrics = scoreAlerts(alerts);
        state.file = { name: "WebMCP record.mif", size: 0, data, errors: [] };
        const dimensions = dimensionScores(data, alerts);
        state.result = { data, alerts, ...metrics, dimensions, validatedAt: new Date().toISOString() };
        renderFiles();
        render();
        return { score: metrics.score, counts: metrics.counts, dimensions, alerts };
      }
    }));
  } catch (error) {
    console.warn("WebMCP registration unavailable", error);
  }
}

const dropzone = $("dropzone");
$("fileInput").addEventListener("change", event => handleFiles(event.target.files));
["dragenter", "dragover"].forEach(type => dropzone.addEventListener(type, event => { event.preventDefault(); dropzone.classList.add("dragging"); }));
["dragleave", "drop"].forEach(type => dropzone.addEventListener(type, event => { event.preventDefault(); dropzone.classList.remove("dragging"); }));
dropzone.addEventListener("drop", event => handleFiles(event.dataTransfer.files));
const exportDialog = $("exportDialog");
$("exportButton").addEventListener("click", () => { if (state.result) exportDialog.showModal(); });
$("closeExportDialog").addEventListener("click", () => exportDialog.close());
exportDialog.addEventListener("click", event => {
  closeDialogOnOutsideClick(exportDialog, event);
  const button = event.target.closest?.("button[data-export-format]");
  if (!button) return;
  exportDialog.close();
  exportReport(button.dataset.exportFormat);
});
$("printButton").addEventListener("click", () => window.print());
$("searchInput").addEventListener("input", event => { state.search = event.target.value; renderAlerts(); });
$("filterGroup").addEventListener("click", event => {
  const button = event.target.closest("button[data-filter]");
  if (!button) return;
  state.activeSeverity = button.dataset.filter;
  render();
});
$("severityGrid").addEventListener("click", event => {
  const button = event.target.closest("button[data-severity]");
  if (!button) return;
  state.activeSeverity = button.dataset.severity;
  $("reportSection").scrollIntoView({ behavior: "smooth", block: "start" });
  render();
});
$("categoryNav").addEventListener("click", event => {
  const button = event.target.closest("button[data-category]");
  if (!button) return;
  state.activeCategory = button.dataset.category;
  render();
});
const dialog = $("methodDialog");
$("methodButton").addEventListener("click", () => dialog.showModal());
$("closeDialog").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", event => closeDialogOnOutsideClick(dialog, event));

document.querySelectorAll("[data-info-dialog]").forEach(button => {
  button.addEventListener("click", () => $(button.dataset.infoDialog).showModal());
});
document.querySelectorAll(".info-dialog:not(.export-dialog)").forEach(infoDialog => {
  infoDialog.querySelector("[data-dialog-close]").addEventListener("click", () => infoDialog.close());
  infoDialog.addEventListener("click", event => closeDialogOnOutsideClick(infoDialog, event));
});

registerWebMcp();
