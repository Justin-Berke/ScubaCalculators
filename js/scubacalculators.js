/* Scuba calculators by Justin Berke
		V.2012.03.15
		These tools are designed to convert common figures 
		  in scuba diving. These tools in no way substitute
		  for qualified & recognized scuba training.
		Contact infomation:
		  http://justinberke.blogspot.com
		  Justin.Berke+scubaCalculators@gmail.com

	Function index:
	A) Global Functions, used by all forms
		1) Select all text in a textbox on focus 
			(by element id)
	B) Equivalent Air Depth
		1) Calculate PO2 (Partial Pressure of Oxygen)
			as a warning for dive planning
		2) Change O2 concentration
			(conversions with full formula)
		3) Calculate Depth and Equilavent Air Depth
			(conversions with full formula)
		4) Handle calculator units/settings
		
	C) Find Depth & Pressure
		1) Convert Depth to Pressure (full formula 
			with pressure unit conversion)
		2) Convert Pressure to Depth (conversions
			with full formula)
		3) Convert and apply Depth Unit of Measure, 
			then re-run the full calculation

	D) Cylinder Volume
		1)Calculate volume of gas in a scuba cylinder
		2) Calculate turn pressure
	*/


// *****************************************************
// A) Global functions, used by all forms
// *****************************************************
	// 1) Select all text in textbox on focus
		function setfocus(id)
			{
			document.getElementById(id).focus();
			document.getElementById(id).select();
			}


// *****************************************************
// B) Equivalent Air Depth
// *****************************************************
	// 1) Calculate PO2
	//		Warn users of unsafe concentrations of oxygen by hilighting the PO2 warning box
	//		  when the partial pressure of O2 value is beyond 1.2 atmospheres
		function EADPO2()
			{
			var FO2 = parseFloat(frmEAD.txtEADO2Mix.value) * 0.01; 			// O2 concentration
			var OneAtm = parseFloat(frmEAD.cboEADWaterType.value);			// Fresh- or Saltwater constant
			var ATA = (parseFloat(frmEAD.txtEADDepth.value) / OneAtm) + 1;	// Depth in absolute atmospheres
			
			// Check if depth units are meters
			if(frmEAD.cboEADdepthUnits.value == 0.3048) // if units = meters
				{
				OneAtm = OneAtm * 0.3048
				ATA = (parseFloat(frmEAD.txtEADDepth.value) / OneAtm) +1;
				}
			
			frmEAD.txtEADPO2.value = (FO2 * ATA).toFixed(2);
			
			// Change textbox color as warning
			
			if (parseFloat(frmEAD.txtEADPO2.value) >= 1.2 && parseFloat(frmEAD.txtEADPO2.value) < 1.4)
				{
				frmEAD.txtEADPO2.style.background = "#ffffdd";
				}
			else if (parseFloat(frmEAD.txtEADPO2.value) >= 1.4 && parseFloat(frmEAD.txtEADPO2.value) < 1.6)
				{
				frmEAD.txtEADPO2.style.background = "#ffdddd";
				}
			else if (parseFloat(frmEAD.txtEADPO2.value) >= 1.6)
				{
				frmEAD.txtEADPO2.style.background = "#ff4444";
				}
			else
				{
				frmEAD.txtEADPO2.style.background = "#ffffff"; // < 1.4
				}
			}
			
	// 2) Change O2 concentration
		function EADO2Mix()
			{
			// Check for correct O2 mix: between 21% & 100%
			if(parseFloat(frmEAD.txtEADO2Mix.value) < 21 || parseFloat(frmEAD.txtEADO2Mix.value) > 100)
				{
				alert("Error: The O2 mix must be between 21% & 100%"); // Alert error
				frmEAD.txtEADO2Mix.style.background = "#ffcccc";	   // Change background to red
				}
			// Otherwise, continue with Depth to EAD calculation
			else
				{
				frmEAD.txtEADO2Mix.style.background = "#ffffff"; // Reset background to white
				DepthToEAD();									 // Call Depth to EAD function
				EADPO2();										 // Calculate PO2 for this mix
				}
			}

	// 3) Calculate Depth and Equilavent Air Depth
		function DepthToEAD()
		//			(1 - Fraction of Oxygen) * (Depth + Water Type [33 ro 34])
		//	EAD =  _____________________________________________ - Water Type [33 or 34] 
		//							0.79
			{
			var FO2 = parseFloat(frmEAD.txtEADO2Mix.value) * 0.01;	// O2 concentration
			var Depth = parseFloat(frmEAD.txtEADDepth.value);		// Depth in feet or meters
			var OneAtm = parseFloat(frmEAD.cboEADWaterType.value);	// Fresh- or Saltwater constant
			
		// Check if depth units are meters
			if(frmEAD.cboEADdepthUnits.value == 0.3048) // if units = meters
				{
				OneAtm = OneAtm * 0.3048
				}
			
		// Run the formula then call the PO2 calculation
			frmEAD.txtEAD.value = ((((1-FO2) * (Depth + OneAtm))/0.79) - OneAtm).toFixed(2);
			EADPO2();
			}
			
		function EADToDepth()
		//			   (EAD + 33) * 0.79
		//	Depth = ________________________ - 33
		//			(1 - Fraction of Oxygen)
			{
			var EAD = parseFloat(frmEAD.txtEAD.value);				// Equivalent Air Depth value
			var FO2 = parseFloat(frmEAD.txtEADO2Mix.value) * 0.01;	// O2 concentration
			var OneAtm = parseFloat(frmEAD.cboEADWaterType.value);	// Fresh- or Saltwater constant
		
		// Check if depth units are meters
			if(frmEAD.cboEADdepthUnits.value == 0.3048) // if units = meters
				{
				OneAtm = OneAtm * 0.3048
				}

		// Run the formula then call the PO2 calculation
			frmEAD.txtEADDepth.value = ((((EAD + 33) * 0.79) / (1 - FO2)) - 33).toFixed(2);
			EADPO2();
			}

			
	// 4) Handle calculator units/settings
	  // Change depth unit of measure
		function EADconvertDepthUnits()
			{
			frmEAD.txtEADDepth.value = parseFloat(frmEAD.txtEADDepth.value) * frmEAD.cboEADdepthUnits.value;
			DepthToEAD();
			}		
	  
	  // Change between fresh and salt water
		function EADWaterType()
			{
			// Just re-run the Depth to EAD calculation
			DepthToEAD();
			}
	
	  // Reset the form
		function EADReset()
			{
			// Set Dive Depth to 0
			frmEAD.txtEADDepth.value = 0;
			}


// *****************************************************
// C) Find Depth & Pressure
// *****************************************************
	// Find Pressure & Depth functions
	// 1) Convert Depth to Pressure
		function depthToPressure()
			{
			var numDepth = parseFloat(frmDepthPressure.txtDepth.value) 					// txtDepth (Depth text box)
			var numWaterTypeValue = parseFloat(frmDepthPressure.waterType.value);  		// waterType (fresh/seawater)
			var numPressureUnits = parseFloat(frmDepthPressure.pressureUnits.value);	// pressureUnits (Constants for atm, psi, bar, etc.)
			var numPressureType = parseFloat(frmDepthPressure.pressureType.value);		// pressureType (gauge/ATA)
			
			// Convert fresh/seawater to meters if necessary
			if(frmDepthPressure.depthUnits.value == 0.3048) // aka: "If Units = meters"
				{
				numWaterTypeValue = frmDepthPressure.waterType.value * 0.3048; // Convert water unit to meters
				}

			//Run the calculation: Pressure = Depth / [1 atm of water] + 1 atmosphere [if applicable] -> Then convert to pressure
			frmDepthPressure.txtPressure.value = (((numDepth / numWaterTypeValue) + numPressureType) * numPressureUnits).toFixed(2);			
			}

	// 2) Convert Pressure to Depth
		function pressureToDepth()
			{
			var numPressure = parseFloat(frmDepthPressure.txtPressure.value) 			// txtPressure (Pressure text box)
			var numWaterTypeValue = parseFloat(frmDepthPressure.waterType.value);  		// waterType (fresh/seawater)
			var numPressureUnits = parseFloat(frmDepthPressure.pressureUnits.value);	// pressureUnits (Constants for atm, psi, bar, etc.)
			var numPressureType = parseFloat(frmDepthPressure.pressureType.value);		// pressureType (gauge/ATA)

			// Convert pressure to Atmospheres
			if(numPressureUnits != 1) // "If pressure units are anything but Atmospheres"
				{
				// (Pressure value / Units) - ATA(*) = Atmospheres
				numPressure = numPressure / numPressureUnits
				}

			// Convert fresh/seawater to meters if necessary
			if(frmDepthPressure.depthUnits.value == 0.3048) // aka: "If Units = meters"
				{
				numWaterTypeValue = frmDepthPressure.waterType.value * 0.3048; // Convert water unit to meters
				}

			// Run the calculation: Depth = (Total Pressure - 1) * [1 atmosphere of water] 
			frmDepthPressure.txtDepth.value = ((numPressure - numPressureType) * numWaterTypeValue).toFixed(2);
			
			//Re-run Depth to Pressure conversion to update with correct pressure reading
			//depthToPressure();
			}

	// 3) Change Depth Unit of Measure
		function convertDepthUnits()
			{
			frmDepthPressure.txtDepth.value = parseFloat(frmDepthPressure.txtDepth.value) * frmDepthPressure.depthUnits.value;
			depthToPressure();
			}


// ************************************************************
// D) Cylinder Volume
// ************************************************************
	// Find the volume of a set of filled or depleted cylinders
	// 1) Calculate volume of gas in a scuba cylinder
	//	General forumula:			
	//	Volume = (Fill pressure * Rated cylinder volume / Rated cylinder pressure) * [Single (1) or Doubled (2) cylinders]

		function CVCalcActualVolume()
			{
			var CVRatedVolume = parseFloat(frmCV.txtCVRatedVolume.value);
			var CVRatedPressure = parseFloat(frmCV.txtCVRatedPressure.value);
			var CVFillPressure = parseFloat(frmCV.txtCVFillPressure.value);
			var CVActualVolume = parseFloat(frmCV.txtCVActualVolume.value);
			var CVNumberOfCylinders = parseFloat(frmCV.cboCVNumberOfCylinders.value);
			
			
			if (CVRatedVolume > 0 && CVRatedPressure > 0)
			  {
			  // Calculate Actual Volume and update the form's textbox
			  CVActualVolume = (CVFillPressure * CVRatedVolume / CVRatedPressure * CVNumberOfCylinders).toFixed(1);
			  frmCV.txtCVActualVolume.value = CVActualVolume;
			
			  // Call the function to calculate turn pressures
			  CVCalcTurnUnit();
			  }
			}

		function CVCalcFillPressure()
			{
			if (parseFloat(frmCV.txtCVRatedVolume.value) > 0 && parseFloat(frmCV.txtCVRatedPressure.value) > 0)
			  {
			  frmCV.txtCVFillPressure.value = (parseFloat(frmCV.txtCVActualVolume.value) * parseFloat(frmCV.txtCVRatedPressure.value	) / parseFloat(frmCV.txtCVRatedVolume.value)).toFixed(0);
			  CVCalcTurnUnit();
			  }
			}

	// 2) Calculate Turn Pressure
		function CVCalcTurnUnit()
			{
			// Calculate a third or sixth
			var CVTurnValue = parseFloat(frmCV.txtCVFillPressure.value) / frmCV.cboCVTurnUnits.value;
			frmCV.txtCVTurnValue.value = (CVTurnValue).toFixed(0);
			
			// Calculate thrids or sixths of the filled pressure
			var CVTurnPressure = parseFloat(frmCV.txtCVFillPressure.value) - CVTurnValue;
			if (CVTurnPressure > 0)
				{
				frmCV.txtCVTurnPressure.value = (CVTurnPressure).toFixed(0);
				}
			else
				{
				frmCV.txtCVTurnPressure.value = 0;
				}
			}
