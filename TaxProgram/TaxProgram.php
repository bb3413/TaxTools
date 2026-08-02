<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8" />
	<link rel="stylesheet" href="../Library/Classes/HTML.css" />
	<link rel="stylesheet" href="../Library/TaxTools/TaxForms.css" />
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
	<div class="tool-container" id="tool-container">
		<p class="version-number">Version: <a href="../Version/Version.html">
			<span id="TaxToolsVersion"></span></a></p>

		<h1 class="title" id="title">Tax Program</h1>
		<h2 class="title">for the Tax Year
			<select id="tax-year" class="trigger" tooltipid="#tax-year-tt">
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
			<input type="button" id="calculate-button" class="trigger button calculate-button"
				value="Calculate" tooltipid="#calculate-button-tt" />

			<!-- Save Button -->
			<input type="button" id="save-button" class="trigger button save-button"
				value="Save" tooltipid="#save-button-tt" />

			<!-- Restore Button -->
			<input type="file" id="input-file" accept=".txt" style="display: none;" />
			<label for="input-file" class="trigger button restore-button"
				tooltipid="#restore-button-tt">Restore</label>
		</div>

		<div class="taxpayer-info-container">
			<p>&nbsp;</p>
			<p>&nbsp;</p>
			<p>Filing Status</p>
			<select class="trigger input-field left" id="filing-status" tooltipid="#filing-status-tt">
				<option value="Single">Single</option>
				<option value="HoH">HoH</option>
				<option value="MFJ">MFJ</option>
				<option value="QSS">QSS</option>
				<option value="MFS">MFS</option>
			</select>
			<p>&nbsp;</p>
			<p>&nbsp;</p>

			<p>Taxpayer's Name</p>
			<input class="trigger input-field left" type="text" id="taxpayers-name"
				spellcheck="false" size="45" tooltipid="#taxpayers-name-tt" />

			<p>Street Address</p>
			<input class="input-field left" type="text" autofocus id="street-address" />

			<p>City</p>
			<input class="input-field left" type="text" id="city" />

			<p>Zip Code</p>
			<input class="input-field left" type="text" id="zip-code"  />

			<p>Taxpayer's Birthday</p>
			<input class="trigger input-field left" type="text" id="taxpayers-birthday" size="36"
				placeholder="mm/dd/yyyy" tooltipid="#taxpayers-birthday-tt" />

			<p>Is Taxpayer Blind</p>
			<input class="trigger checkbox" type="checkbox" id="is-taxpayer-blind"
				tooltipid="#is-taxpayer-blind-tt" />
		</div>

		<div class="taxpayer-info-container" id="spouse-container">
			<p>Spouse's Birthday</p>
			<input class="trigger input-field left" type="text" id="spouses-birthday" size="36"
				placeholder="mm/dd/yyyy" tooltipid="#spouses-birthday-tt" />

			<p>Is Spouse Blind</p>
			<input class="trigger checkbox" type="checkbox" id="is-spouse-blind"
				tooltipid="#is-spouse-blind-tt" />
		</div>

		<p>&nbsp;</p>
		<h2>Input Forms</h2>
		<?php include "../Library/TaxForms-In/Taxpayer.html"; ?>
		<?php include "../Library/TaxForms-In/W2.html"; ?>

		<!-- Display area for Tax Return. -->
		<p>&nbsp;</p>
		<div id="tax-return-container">
			<!--<p id="tax-return-output" class="tax-return-output"></p>-->
			<?php include "../Library/TaxForms-Out/F1040.html"; ?>
		</div>

		<!-- Display area for error messages. -->
		<div id="error-message-container">
			<p id="error-message-output"></p>
		</div>

		<!-- Display area for debugging information. -->
		<div id="debug-container">
			<h3>Debugging Output</h3>
			<pre id="debug-output"></pre>
		</div>

		<!-- Tooltips -->
		<?php include "TaxProgram-HelpInput.html"; ?>
	</div>
</body>
</html>
