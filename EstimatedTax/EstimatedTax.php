<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8" />
    <?php include "../Library/TaxToolsIncludeFiles.html"; ?>
	<link rel="stylesheet" href="EstimatedTax.css" />
	<script defer src="SaveRestore.js"></script>
	<script defer src="EstimatedTax.js"></script>
		
	<title>Federal Estimated Tax Calculator</title>
</head>

<body>
	<div class="tool-container">
		<h1 class="title">Federal Estimated Tax Calculator</h1>
		<h2 class="title">for the Tax Year
			<select id="TaxYear" class="trigger" tooltipid="#TaxYearTT">
				<option value="2026">2026</option>
				<option value="2025">2025</option>
				<option value="2024">2024</option>
			</select>
		</h2>
		<p>This tool is intended to help you determine how much federal income tax you
		would owe given the data you provide. Unlike a program for doing your taxes, which
		performs many more calculations, this tool just computes the amount of the tax
		given the values you enter. This allows you to experiment with different values to
		see the effect on your taxes. In addition, this makes it very easy to enter information
		and get an immediate answer.</p>

		<p>The blue fields are computed from the information you provide. The green fields are
		where you enter information. The first column shows where the information can be found
		in the tax return. Click <a href="EstimatedTax-Help.html	">this link</a> for more help
		with this tool.</p>

		<h3>Tax Formula</h3>
		<p>The tax formula below describes, at a high level, how the tax is calculated. The value of
		each item in the tax formula is shown in the Estimated Tax Calculation. You can see a brief
		description of any of the items by moving the mouse over the calculated value in the
		Estimated Tax Calculation.</p>

		<div class="tax-formula-container">
			<p>Total Income</p>
			<p>= Income from all sources - Non-taxable Income</p>
			<p>Adjusted Gross Income</p>
			<p>= Total Income - Adjustments</p>
			<p>Taxable Income</p>
			<p>= Adjusted Gross Income - Deductions</p>
			<p>Total Tax</p>
			<p>= Tax on Taxable Income + Other Taxes - Non-refundable Credits</p>
			<p>Refund / Amount Due</p>
			<p>= Payments + Refundable Credits - Total Tax</p>
			<p>Estimated Quarterly Tax Payments</p>
			<p>= (Estimated Payments - Amount Due) / 4</p>
			<p>&nbsp;</p>
			<p>&nbsp;</p>
		</div>

		<div class="save-restore">
			<!-- Save Button -->
			<input type="button" id="SaveButton" class="trigger button save-button"
				value="Save" tooltipid="#SaveButtonTT" />
				
			<!-- Restore Button -->
			<input type="file" id="InputFile" accept=".txt" style="display: none;" />
			<label for="InputFile" class="trigger button restore-button" tooltipid="#RestoreButtonTT">Restore</label>
		</div>

		<div class="taxpayer-info-box">
			<div class="taxpayer-info-container">
				<p class="label-field right">Taxpayer's Name</p>
				<input class="trigger input-field left" type="text" id="TaxpayersName"
					spellcheck="false" size="36" tooltipid="#TaxpayersNameTT" />

				<p class="label-field right">Version</p>
				<p class="trigger output-field right" tooltipid="#TaxToolsVersionTT">
					<a href="../Version/Version.html"><span id="TaxToolsVersion"></span></a></p>

				<p class="label-field right">Filing Status</p>
				<select class="trigger input-field left" id="FilingStatus" tooltipid="#FilingStatusTT">
					<option value="Single">Single</option>
					<option value="HoH">HoH</option>
					<option value="MFJ">MFJ</option>
					<option value="QSS">QSS</option>
					<option value="MFS">MFS</option>
				</select>

				<p class="label-field right">Today's Date</p>
				<p class="trigger output-field right" id="TodaysDate" tooltipid="#TodaysDateTT">0</p>

				<p class="label-field right">Taxpayer's Birthday</p>
				<input class="trigger input-field left" type="text" id="TaxpayersBirthday" size="36"
					placeholder="mm/dd/yyyy" tooltipid="#TaxpayersBirthdayTT" />

				<p class="label-field right">Taxpayer's Age</p>
				<p class="trigger output-field" id="TaxpayersAge" tooltipid="#TaxpayersAgeTT">0</p>

				<p class="label-field right">Spouse's Birthday</p>
				<input class="trigger input-field left" type="text" id="SpousesBirthday" size="36"
					placeholder="mm/dd/yyyy" tooltipid="#SpousesBirthdayTT" />

				<p class="label-field right">Spouse's Age</p>
				<p class="trigger output-field" id="SpousesAge" tooltipid="#SpousesAgeTT">0</p>
			</div>

			<h3>Estimated Tax Calculation</h3>
			<div class="taxpayer-data-container">
				<p>1040, line 9</p>
				<p>Total Income</p>
				<p class="trigger output-field" id="TotalIncome" tooltipid="#TotalIncomeTT">0</p>

				<p>1040, line 10</p>
				<p>Adjustments</p>
				<p class="trigger output-field" id="Adjustments" tooltipid="#AdjustmentsTT">0</p>

				<p>1040, line 11</p>
				<p>Adjusted Gross Income</p>
				<p class="trigger output-field" id="AdjustedGrossIncome" tooltipid="#AdjustedGrossIncomeTT">0</p>

				<p>1040, line 12</p>
				<p>Deductions</p>
				<p class="trigger output-field" id="Deductions" tooltipid="#DeductionsTT">0</p>

				<p>1040, line 15</p>
				<p>Taxable Income</p>
				<p class="trigger output-field" id="TaxableIncome" tooltipid="#TaxableIncomeTT">0</p>

				<p>1040, line 16</p>
				<p>Tax on Taxable Income</p>
				<p class="trigger output-field" id="TaxOnTaxableIncome" tooltipid="#TaxOnTaxableIncomeTT">0</p>

				<p>1040, line 23</p>
				<p>Other Taxes</p>
				<p class="trigger output-field" id="TotalOtherTaxes" tooltipid="#TotalOtherTaxesTT">0</p>

				<p>1040, line 20</p>
				<p>Non-refundable Credits</p>
				<p class="trigger output-field" id="NonrefundableCredits"
					tooltipid="#NonrefundableCreditsTT">0</p>

				<p>1040, line 24</p>
				<p>Total Tax</p>
				<p class="trigger output-field" id="TotalTax" tooltipid="#TotalTaxTT">0</p>

				<p>1040, line 32</p>
				<p>Refundable Credits</p>
				<p class="trigger output-field" id="RefundableCredits" tooltipid="#RefundableCreditsTT">0</p>

				<p>1040, line 25, 26</p>
				<p>Payments</p>
				<p class="trigger output-field" id="Payments" tooltipid="#PaymentsTT">0</p>

				<p>1040, line 34, 37</p>
				<p>Refund(+) / Amount Due(-)</p>
				<p class="trigger output-field" id="AmountDue" tooltipid="#AmountDueTT">0</p>

				<p>1040-ES</p>
				<p>Estimated Quarterly Tax Payments</p>
				<p class="trigger output-field" id="EstimatedTax" tooltipid="#EstimatedTaxTT">0</p>
			</div>
		</div>

		<h2 class="title">Input Data</h2>
		<h3>Income</h3>
		<div class="taxpayer-data-container">
			<p>1040, line 1z</p>
			<p>Wages</p>
			<input class="trigger input-field" type="text" id="Wages"
				placeholder="0" size="10" tooltipid="#WagesTT" />

			<p>1040, line 2a</p>
			<p>Tax-exempt Interest</p>
			<input class="trigger input-field" type="text" id="TaxExemptInterest"
				placeholder="0" size="10" tooltipid="#TaxExemptInterestTT" />

			<p>1040, line 2b</p>
			<p>Taxable Interest</p>
			<input class="trigger input-field" type="text" id="TaxableInterest"
				placeholder="0" size="10" tooltipid="#TaxableInterestTT" />

			<p>1040, line 3a</p>
			<p>Qualified Dividends</p>
			<input class="trigger input-field" type="text" id="QualifiedDividends"
				placeholder="0" size="10" tooltipid="#QualifiedDividendsTT" />

			<p>1040, line 3b</p>
			<p>Ordinary Dividends</p>
			<input class="trigger input-field" type="text" id="OrdinaryDividends"
				placeholder="0" size="10" tooltipid="#OrdinaryDividendsTT" />

			<p>1040, line 4b-5b</p>
			<p>Retirement Accounts, Pensions, Annuities (taxable amount only)</p>
			<input class="trigger input-field" type="text" id="RetirementAccounts"
				placeholder="0" size="10" tooltipid="#RetirementAccountsTT" />

			<p>1040, line 6a</p>
			<p>Social Security (total amount received: SSA-1099, box 5)</p>
			<input class="trigger input-field" type="text" id="SocialSecurity"
				placeholder="0" size="10" tooltipid="#SocialSecurityTT" />

			<p>1040, line 7a</p>
			<p>Capital Gains</p>
			<input class="trigger input-field" type="text" id="CapitalGains"
				placeholder="0" size="10" tooltipid="#CapitalGainsTT" />

			<p>1040, line 7</p>
			<p>Self-employment Income</p>
			<input class="trigger input-field" type="text" id="SelfEmploymentIncome"
				placeholder="0" size="10" tooltipid="#SelfEmploymentIncomeTT" />

			<p>1040, line 8</p>
			<p>Other Income</p>
			<input class="trigger input-field" type="text" id="OtherIncome"
				placeholder="0" size="10" tooltipid="#OtherIncomeTT" />
		</div>

		<h3>Other Taxes</h3>
		<div class="taxpayer-data-container">
			<p>1040 S2, line 4</p>
			<p>Self-employment Tax</p>
			<input class="trigger input-field" type="text" id="SelfEmploymentTax"
				placeholder="0" size="10" tooltipid="#SelfEmploymentTaxTT" />

			<p>1040 S2, line 8</p>
			<p>Early Withdrawal Tax</p>
			<input class="trigger input-field" type="text" id="EarlyWithdrawalTax"
				placeholder="0" size="10" tooltipid="#EarlyWithdrawalTaxTT" />

			<p>1040, line 23</p>
			<p>Other Taxes</p>
			<input class="trigger input-field" type="text" id="OtherTaxes"
				placeholder="0" size="10" tooltipid="#OtherTaxesTT" />
		</div>

		<h3>Adjustments</h3>
		<div class="taxpayer-data-container">
			<p>1040 S1, line 11</p>
			<p>Educator Expenses</p>
			<input class="trigger input-field" type="text" id="EducatorExpenses"
				placeholder="0" size="10" tooltipid="#EducatorExpensesTT" />

			<p>1040 S1, line 13</p>
			<p>Health Savings Account Contributions</p>
			<input class="trigger input-field" type="text" id="HealthSavingsAccount"
				placeholder="0" size="10" tooltipid="#HealthSavingsAccountTT" />

			<p>1040 S1, line 15</p>
			<p>Self-employment Tax Adjustment</p>
			<input class="trigger input-field" type="text" id="SelfEmploymentTaxAdjustment"
				placeholder="0" size="10" tooltipid="#SelfEmploymentTaxAdjustmentTT" />

			<p>1040 S1, line 17</p>
			<p>Self-employed Health Insurance</p>
			<input class="trigger input-field" type="text" id="SelfEmployedHealthInsurance"
				placeholder="0" size="10" tooltipid="#SelfEmployedHealthInsuranceTT" />

			<p>1040 S1, line 18</p>
			<p>Early Withdrawal Penalty</p>
			<input class="trigger input-field" type="text" id="EarlyWithdrawalPenalty"
				placeholder="0" size="10" tooltipid="#EarlyWithdrawalPenaltyTT" />

			<p>1040 S1, line 19</p>
			<p>Alimony Paid</p>
			<input class="trigger input-field" type="text" id="AlimonyPaid"
				placeholder="0" size="10" tooltipid="#AlimonyPaidTT" />

			<p>1040 S1, line 20</p>
			<p>IRA Contributions</p>
			<input class="trigger input-field" type="text" id="IRAContributions"
				placeholder="0" size="10" tooltipid="#IRAContributionsTT" />

			<p>1040 S1, line 21</p>
			<p>Student Loan Interest</p>
			<input class="trigger input-field" type="text" id="StudentLoanInterest"
				placeholder="0" size="10" tooltipid="#StudentLoanInterestTT" />

			<p>1040 S1, line 25</p>
			<p>Other Adjustments</p>
			<input class="trigger input-field" type="text" id="OtherAdjustments"
				placeholder="0" size="10" tooltipid="#OtherAdjustmentsTT" />
		</div>

		<h3>Deductions (non-itemized)</h3>
		<div class="taxpayer-data-container">
			<p>1040, line 13a</p>
			<p>Qualified Business Income Deduction</p>
			<input class="trigger input-field" type="text" id="QualifiedBusinessIncomeDeduction"
				placeholder="0" size="10" tooltipid="#QualifiedBusinessIncomeDeductionTT" />

			<p>1040 S1-A, line 13</p>
			<p>Qualified Tips Deduction</p>
			<input class="trigger input-field" type="text" id="QualifiedTipsDeduction"
				placeholder="0" size="10" tooltipid="#QualifiedTipsDeductionTT" />

			<p>1040 S1-A, line 21</p>
			<p>Qualified Overtime Deduction</p>
			<input class="trigger input-field" type="text" id="QualifiedOvertimeDeduction"
				placeholder="0" size="10" tooltipid="#QualifiedOvertimeDeductionTT" />

			<p>1040 S1-A, line 30</p>
			<p>Car Loan Interest Deduction</p>
			<input class="trigger input-field" type="text" id="CarLoanInterestDeduction"
				placeholder="0" size="10" tooltipid="#CarLoanInterestDeductionTT" />

			<p>1040 S1-A, line 37</p>
			<p>Enhanced Deduction for Seniors</p>
			<input class="trigger input-field" type="text" id="SeniorDeduction"
				placeholder="0" size="10" tooltipid="#SeniorDeductionTT" />
		</div>

		<h3>Deductions</h3>
		<div class="taxpayer-data-container">
			<p>Schedule A, line 1</p>
			<p>Medical Insurance</p>
			<input class="trigger input-field" type="text" id="MedicalInsurance"
				placeholder="0" size="10" tooltipid="#MedicalInsuranceTT" />

			<p>Schedule A, line 1</p>
			<p>Doctor Visits</p>
			<input class="trigger input-field" type="text" id="DoctorVisits"
				placeholder="0" size="10" tooltipid="#DoctorVisitsTT" />

			<p>Schedule A, line 1</p>
			<p>Prescription Medication</p>
			<input class="trigger input-field" type="text" id="PrescriptionDrugs"
				placeholder="0" size="10" tooltipid="#PrescriptionDrugsTT" />

			<p>Schedule A, line 1</p>
			<p>Medical Aids</p>
			<input class="trigger input-field" type="text" id="MedicalAids"
				placeholder="0" size="10" tooltipid="#MedicalAidsTT" />

			<p>Schedule A, line 1</p>
			<p>Long Term Care Insurance (taxpayer)</p>
			<input class="trigger input-field" type="text" id="LTCTaxpayer"
				placeholder="0" size="10" tooltipid="#LTCTaxpayerTT" />

			<p>Schedule A, line 1</p>
			<p>Long Term Care Insurance (spouse)</p>
			<input class="trigger input-field" type="text" id="LTCSpouse"
				placeholder="0" size="10" tooltipid="#LTCSpouseTT" />

			<p>Schedule A, line 1</p>
			<p>Medical Miles</p>
			<input class="trigger input-field" type="text" id="MedicalMiles"
				placeholder="0" size="10" tooltipid="#MedicalMilesTT" />

			<p>Schedule A, line 1</p>
			<p>Other Medical Expenses</p>
			<input class="trigger input-field" type="text" id="OtherMedicalExpenses"
				placeholder="0" size="10" tooltipid="#OtherMedicalExpensesTT" />

			<p>Schedule A, line 5a</p>
			<p>State Income Tax</p>
			<input class="trigger input-field" type="text" id="StateIncomeTax"
				placeholder="0" size="10" tooltipid="#StateIncomeTaxTT" />

			<p>Schedule A, line 5a</p>
			<p>Sales Tax</p>
			<input class="trigger input-field" type="text" id="SalesTax"
				placeholder="0" size="10" tooltipid="#SalesTaxTT" />

			<p>Schedule A, line 5b</p>
			<p>Real Estate Property Tax</p>
			<input class="trigger input-field" type="text" id="RealEstatePropertyTax"
				placeholder="0" size="10" tooltipid="#RealEstatePropertyTaxTT" />

			<p>Schedule A, line 5c</p>
			<p>Personal Property Tax</p>
			<input class="trigger input-field" type="text" id="PersonalPropertyTax"
				placeholder="0" size="10" tooltipid="#PersonalPropertyTaxTT" />

			<p>Schedule A, line 10</p>
			<p>Mortgage Interest</p>
			<input class="trigger input-field" type="text" id="MortgageInterest"
				placeholder="0" size="10" tooltipid="#MortgageInterestTT" />

			<p>Schedule A, line 11</p>
			<p>Cash Gifts to Charity</p>
			<input class="trigger input-field" type="text" id="CashGiftsToCharity"
				placeholder="0" size="10" tooltipid="#CashGiftsToCharityTT" />

			<p>1040 S1-A, line 10</p>
			<p>Non-cash Gifts to Charity</p>
			<input class="trigger input-field" type="text" id="NoncashGiftsToCharity"
				placeholder="0" size="10" tooltipid="#NoncashGiftsToCharityTT" />

			<p></p>
			<p>Qualified Charitable Distribution</p>
			<input class="trigger input-field" type="text" id="QualifiedCharitableDistribution"
				placeholder="0" size="10" tooltipid="#QualifiedCharitableDistributionTT" />
		</div>

		<h3>Non-refundable Credits</h3>
		<div class="taxpayer-data-container">
			<p>Schedule 3, line 3</p>
			<p>Americal Opportunity Credit (non-refundable part)</p>
			<input class="trigger input-field" type="text" id="AmericanOppCreditNoRefund"
				placeholder="0" size="10" tooltipid="#AmericanOppCreditNoRefundTT" />

			<p>Schedule 3, line 2</p>
			<p>Child and Dependent Care Credit</p>
			<input class="trigger input-field" type="text" id="ChildCareCredit"
				placeholder="0" size="10" tooltipid="#ChildCareCreditTT" />

			<p>1040, line 19</p>
			<p>Child Tax Credit</p>
			<input class="trigger input-field" type="text" id="ChildTaxCredit"
				placeholder="0" size="10" tooltipid="#ChildTaxCreditTT" />

			<p>Schedule 3, line 1</p>
			<p>Foreign Tax Credit</p>
			<input class="trigger input-field" type="text" id="ForeignTaxCredit"
				placeholder="0" size="10" tooltipid="#ForeignTaxCreditTT" />

			<p>Schedule 3, line 3</p>
			<p>Lifetime Learning Credit</p>
			<input class="trigger input-field" type="text" id="LifetimeLearningCredit"
				placeholder="0" size="10" tooltipid="#LifetimeLearningCreditTT" />

			<p>Schedule 3, line 5</p>
			<p>Residential Energy Credit</p>
			<input class="trigger input-field" type="text" id="ResidentialEnergyCredit"
				placeholder="0" size="10" tooltipid="#ResidentialEnergyCreditTT" />

			<p>Schedule 3, line 4</p>
			<p>Retirement Savings Contribution Credit</p>
			<input class="trigger input-field" type="text" id="RetirementSavingsCredit"
				placeholder="0" size="10" tooltipid="#RetirementSavingsCreditTT" />

			<p>Schedule 3, line 6</p>
			<p>Other Non-refundable Credits</p>
			<input class="trigger input-field" type="text" id="OtherNonrefundableCredits"
				placeholder="0" size="10" tooltipid="#OtherNonrefundableCreditsTT" />
		</div>

		<h3>Refundable Credits</h3>
		<div class="taxpayer-data-container">
			<p>Schedule 3, line 3</p>
			<p>Americal Opportunity Credit (refundable part)</p>
			<input class="trigger input-field" type="text" id="AmericanOppCreditRefundable"
				placeholder="0" size="10" tooltipid="#AmericanOppCreditRefundableTT" />

			<p>1040, line 19</p>
			<p>Credit for Other Dependents</p>
			<input class="trigger input-field" type="text" id="CreditForOtherDependents"
				placeholder="0" size="10" tooltipid="#CreditForOtherDependentsTT" />		

			<p>1040, line 27</p>
			<p>Earned Income Credit</p>
			<input class="trigger input-field" type="text" id="EarnedIncomeCredit"
				placeholder="0" size="10" tooltipid="#EarnedIncomeCreditTT" />

			<p>Schedule 3, line 9</p>
			<p>Premium Tax Credit</p>
			<input class="trigger input-field" type="text" id="PremiumTaxCredit"
				placeholder="0" size="10" tooltipid="#PremiumTaxCreditTT" />

			<p>Schedule 3, line 13</p>
			<p>Other Refundable Credits</p>
			<input class="trigger input-field" type="text" id="OtherRefundableCredits"
				placeholder="0" size="10" tooltipid="#OtherRefundableCreditsTT" />
		</div>

		<h3>Payments</h3>
		<div class="taxpayer-data-container">
			<p>1040, line 25d</p>
			<p>Withholding</p>
			<input class="trigger input-field" type="text" id="Withholding"
				placeholder="0" size="10" tooltipid="#WithholdingTT" />

			<p>1040, line 26</p>
			<p>Estimated Taxes Paid</p>
			<input class="trigger input-field" type="text" id="EstimatedTaxPaid"
				placeholder="0" size="10" tooltipid="#EstimatedTaxPaidTT" />
		</div>

		<!-- Debugging Fields -->
        <?php include "EstimatedTax-Debug.html"; ?>
        <?php include "../Library/IncomeTax/IncomeTax-Debug.html"; ?>
        <?php include "../Library/SocialSecurity/SocialSecurity-Debug.html"; ?>

		<!-- Tooltips -->
        <?php include "EstimatedTax-HelpInput.html"; ?>
	</div>
</body>
</html>
