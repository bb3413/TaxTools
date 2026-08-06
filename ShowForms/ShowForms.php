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

	<script type="module" src="ShowForms.js"></script>
	<title>Tax Program</title>
</head>

<body>
	<div class="tool-container" id="tool-container">
		<p class="version-number">Version: <a href="../Version/Version.html">
			<span id="TaxToolsVersion"></span></a></p>

		<h1 class="title" id="title">Tax Forms</h1>
		<div id="insert-tax-forms-here"></div>
		<?php include "../Library/TaxForms-HTML/Taxpayer.html"; ?>
	</div>
</body>
</html>
