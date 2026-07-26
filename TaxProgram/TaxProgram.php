<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8" />
	<link rel="stylesheet" href="../Library/Classes/HTML.css" />
	<link rel="stylesheet" href="../Library/Forms-HTML/TaxForm.css" />
	<link rel="stylesheet" href="../Library/TaxTools/TaxTools.css" />
	<link rel="stylesheet" href="../Library/Tooltips/Tooltips.css" />

	<script type="module" src="../Library/TaxTools/TaxTools.js"></script>
	<script type="module" src="../Library/Tooltips/Tooltips.js"></script>
	<script type="module" src="../Version/Version.js"></script>

	<link rel="stylesheet" href="TaxProgram.css" />
	<script type="module" src="TaxProgram.js"></script>
	<title>Tax Program</title>
</head>

<body>
	<div class="tool-container">
		<p class="version-number">Version: <a href="../Version/Version.html">
			<span id="TaxToolsVersion"></span></a></p>

		<h1 class="title" id="Title">Tax Program</h1>
		<h2 class="title">for the Tax Year
			<select id="TaxYear" class="trigger" tooltipid="#TaxYearTT">
				<option value="2026">2026</option>
				<option value="2025">2025</option>
				<option value="2024">2024</option>
			</select>
		</h2>

		<p>&nbsp;</p>
		<p>This tool is intended... Click <a href="TaxProgram-Help.html">this link</a> for more help
		with this tool.</p>

		<div class="button-container">
			<!-- Calculate Button -->
			<input type="button" id="CalculateButton" class="trigger button calculate-button"
				value="Calculate" tooltipid="#CalculateButtonTT" />

			<!-- Save Button -->
			<input type="button" id="SaveButton" class="trigger button save-button"
				value="Save" tooltipid="#SaveButtonTT" />

			<!-- Restore Button -->
			<input type="file" id="InputFile" accept=".txt" style="display: none;" />
			<label for="InputFile" class="trigger button restore-button"
				tooltipid="#RestoreButtonTT">Restore</label>
		</div>

		<div class="taxpayer-info-container">
			<p>&nbsp;</p>
			<p>&nbsp;</p>
			<p class="label-field">Taxpayer's Name</p>
			<input class="trigger input-field left" type="text" id="TaxpayersName"
				spellcheck="false" size="36" tooltipid="#TaxpayersNameTT" />

			<p class="label-field">Filing Status</p>
			<select class="trigger input-field left" id="FilingStatus" tooltipid="#FilingStatusTT">
				<option value="Single">Single</option>
				<option value="HoH">HoH</option>
				<option value="MFJ">MFJ</option>
				<option value="QSS">QSS</option>
				<option value="MFS">MFS</option>
			</select>

			<p class="label-field">Taxpayer's Birthday</p>
			<input class="trigger input-field left" type="text" id="TaxpayersBirthday" size="36"
				placeholder="mm/dd/yyyy" tooltipid="#TaxpayersBirthdayTT" />

			<p>Taxpayer Is Blind</p>
			<input class="trigger checkbox" type="checkbox" id="TaxpayerIsBlind"
				tooltipid="#TaxpayerIsBlindTT" />
		</div>

		<div class="taxpayer-info-container" id="SpouseContainer">
			<p class="label-field">Spouse's Birthday</p>
			<input class="trigger input-field left" type="text" id="SpousesBirthday" size="36"
				placeholder="mm/dd/yyyy" tooltipid="#SpousesBirthdayTT" />

			<p>Spouse Is Blind</p>
			<input class="trigger checkbox" type="checkbox" id="SpouseIsBlind"
				tooltipid="#SpouseIsBlindTT" />
		</div>

		<p>&nbsp;</p>
		<!-- Forms -->
		<?php include "../Library/Forms-HTML/F1040.html"; ?>
		<?php include "../Library/Forms-HTML/W2.html"; ?>

		<!-- Display area for Tax Return. -->
		<p>&nbsp;</p>
		<div id="TaxReturnContainer">
			<p id="TaxReturnOutput" class="tax-return-output"></p>
		</div>

		<!-- Display area for error messages. -->
		<div id="ErrorMessageContainer">
			<p id="ErrorMessageOutput"></p>
		</div>

		<!-- Display area for debugging information. -->
		<div id="DebugContainer">
			<h3>Debugging Output</h3>
			<pre id="DebugOutput"></pre>
		</div>

		<!-- Tooltips -->
		<?php include "TaxProgram-HelpInput.html"; ?>
	</div>
</body>
</html>
