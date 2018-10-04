google.charts.load('current', {'packages':['corechart','table']});
jQuery.noConflict();
var statenametext = null;
var stringContent = null;
var yearstext = null;
var reportType = null;
var chartTitle = null;
var formatVAxis = null;
var tableStringContent = [];
var sheetName = [];
var query = null;
var tableDiv = null;
var reportHeading = [];
var formURL = [];
var formSheetname = [];
var formTitles = [];
var typeCount = null;
var countStates = null;
var countYears = null;
var countCats = null;

jQuery( document ).ready(function() {
var summaryCheck = summCheck = summReportChecked();
 // var updateSelections = readSelections();
var checkState = countChecks('state'); 
var checkYears = countChecks('year'); 
var checkCats = countChecks('category');
 if (countChecks('state') == 0 && countChecks('year') == 0 && countChecks('category') == 0) { jQuery('.selectWarn').remove();
    jQuery('#chart_div').prepend('<h5 class="selectWarn clearable">Go ahead make my day.  Choose something.</h5><p class="selectWarn clearable">Choose a category at left and state(s) and year(s) above to begin.</p>'); jQuery('#chart_div > div').remove(); jQuery('input#spreadDL').hide();

 }
 jQuery('select').change(countChecks);
 jQuery('div').accessibleSimpleTooltipAria({
    simpletooltipText: 'title'
  });

       
 jQuery('#chartRedraw').click(function(){
     var newChart = drawSheetName();
    });
 jQuery('#stateSelect').multiselect({
     enableClickableOptGroups: true,
     allSelectedText: 'All',
     includeSelectAllOption: true
    });
    
    
 jQuery('#yearSelect').multiselect({
     enableClickableOptGroups: true,
     allSelectedText: 'All',
     includeSelectAllOption: true
    });

    jQuery('input[name="reportChoose"]').click( function(event) {
        
        checkit = summReportChecked();
    });
    
    jQuery('#clearForm').click(function(){
  jQuery('#stateSelect').val([]).multiselect('refresh');

  jQuery('#yearSelect').val([]).multiselect('refresh');
  jQuery('input[name="reportChoose"]').prop('checked',false);

  jQuery('input[name="summChoose"]').prop('checked',false);

    });
    
    if (checkState != 0 && checkYears != 0 && checkCats != 0) google.charts.setOnLoadCallback(drawSheetName);
    
    
});



function countChecks(typeCount = null) {
        
        countStates = jQuery("#stateDrop option:selected").length;
        countYears = jQuery("#yearDrop option:selected").length;
        checkCount = countStates * countYears;
        catCount = jQuery('input[name="reportChoose"]:checked').val() ? 1: 0;
        return !typeCount ? checkCount : (typeCount == 'state' ? countStates : ( typeCount == 'year' ? countYears :catCount));
}



function summReportChecked() {
     // console.log('It is checked');
    
     if(jQuery('input[name="reportChoose"]:checked').val() == '31') {
         jQuery('#summYear').show();
        
       
        jQuery('button.multiselect.dropdown-toggle').prop('disabled',true);
        jQuery('#stateDrop').hide(); jQuery('#yearDrop').hide();
        

        
        } else {
             
        jQuery('button.multiselect.dropdown-toggle').removeAttr('disabled');
        jQuery('#stateDrop').show(); jQuery('#yearDrop').show();
        jQuery('#summYear').hide();
        jQuery('')
           
    }
    


}


var legends = [
    ['Vision','Hearing','Speech','Learning','Mobility','Daily living','Environmental','Vehicle','Computers','Recreation'],
    ['Indivs. w/ disabilities','Family members','Reps. of education','Reps. of employment','Reps. of health','Reps. of community living','Reps. of technology'],
    ['Highly satisfied','Satisfied','Satisfied somewhat','Not satisfied'],
    ['Assist in decision-making','Serve as loaner','Provide accommodation','Training'],
    ['Products','Funding','Technology','Combination','Transition']

];
function legendBuild(legendNum) {
    var legendOut = [];
    arraySub = legends[legendNum];
    var numCount = arraySub.length;
    if(numCount < 1) return;
    //legendStruct = '<div class="legendElem"><div class="legendColorBlock legendNum' + legendNum + '"></div>' + legNumText + '</div>';
    for (i = 0; i < numCount; i++) {
        legendOut.push( '<div class="legendElem"><div class="legendColorBlock legendNum' + i + '"></div><div class="legendText">' + arraySub[i] + '</div></div>' );

    }
    return legendOut;
}

function drawSheetName() {

    if ((countChecks('state') != 0 && countChecks('year') != 0 && jQuery('input[name="reportChoose"]:checked').val() != '31') || ( jQuery('input[name="reportChoose"]:checked').val() == '31' && jQuery('input[name="summChoose"]:checked').val())) {

    tableStringContent = [];
    legendHTML = null;
 
    tableDiv = 0;
    var statename1 = jQuery('select#stateSelect').val();
    statenames = statename1.join("' OR D = '");
    statenametext = statename1.length < 1 ? ' ' : statename1.join(", ");
    var years1 = jQuery('input[name="reportChoose"]:checked').val() == '31' ? jQuery('input[name="summChoose"]:checked').val() : jQuery('select#yearSelect').val();
    years = jQuery('input[name="reportChoose"]:checked').val() != '31' ? years1.length < 1 ? '2012' : years1.join(' OR E = ') : years1;
    yearstext = jQuery('input[name="reportChoose"]:checked').val() != '31' ?  years1.length < 1 ? '2012' : years1.join(', ') : years1;
    var reportchoice= jQuery('input[name="reportChoose"]:checked').val();
    reporttitle = jQuery('input[name="reportChoose"]:checked').parent('label').text();
    var statesFilenm = statenametext;
    if(statenametext.length > 14) {
        statesFilenm = statenametext.substring(0,14);
    }
    var yrsFilenm = yearstext;
    if(yearstext.length > 14) {
        yrsFilenm = yearstext.substring(0,14);
    }
    
    sheetName = [];
    chartURL = 'https://docs.google.com/spreadsheets/d/1Zutzmq6IFxyHqOpwwjKqUeRhPt8WxY3a5TpvYdQYYf8';
    switch(reportchoice) {
        case '1':
        stringContent = "SELECT B,AF,AG,AH,AI,AJ,AK,AL,AM,AN,AO WHERE (D = '" + statenames + "') AND (E = " + years + ") AND Q > 0 ORDER BY A, E LIMIT 8";
        // tableStringContent[0] = "SELECT A,E,Q,F,G,H,I,J,K,L,M,N,O,P WHERE (D = '" + statenames + "') AND (E = " + years + ") ORDER BY A, E";
        tableStringContent[0] = "SELECT A,E,Q,AF,AG,AH,AI,AJ,AK,AL,AM,AN,AO,AP WHERE (D = '" + statenames + "') AND (E = " + years + ") AND Q > 0 ORDER BY A, E";
        sheetName[0] = 'sheet=x_dd_export_full&';
        reportHeading[0] = "Device Demonstrations: Type of AT";
        legendHTML = legendBuild(0);
        break;
        
        case '2':
        stringContent = "SELECT B,AQ,AR,AS,AT,AU,AV,AW WHERE (D = '" + statenames + "') AND (E = " + years + ") AND Z > 0 ORDER BY C LIMIT 8";
        // tableStringContent[0] = "SELECT A,E,Z,R,S,T,U,V,W,X,Y WHERE (D = '" + statenames + "') AND (E = " + years + ") ORDER BY A, E";
        tableStringContent[0] = "SELECT A,E,Z,AQ,AR,AS,AT,AU,AV,AW,AX WHERE (D = '" + statenames + "') AND (E = " + years + ") AND Z > 0 ORDER BY A, E";
        sheetName[0] = 'sheet=x_dd_export_full&';
        reportHeading[0] = "Device Demonstrations: Participants";
        legendHTML = legendBuild(1);
        break;
        
        case '3':
        stringContent = "SELECT B,AY,AZ,BA,BB WHERE (D = '" + statenames + "') AND (E = " + years + ") AND AE > 0 ORDER BY A, E LIMIT 8";
        // tableStringContent[0] = "SELECT A,E,AE,AA,AB,AC,AD WHERE (D = '" + statenames + "') AND (E = " + years + ") ORDER BY A, E";
        tableStringContent[0] = "SELECT A,E,AE,AY,AZ,BA,BB WHERE (D = '" + statenames + "') AND (E = " + years + ") AND AE > 0 ORDER BY A, E";
        sheetName[0] = 'sheet=x_dd_export_full&';
        reportHeading[0] = "Device Demonstrations: Customer Satisfaction";
        legendHTML = legendBuild(2);
        break;
        
        case '4':
        stringContent = "SELECT B,AL,AM,AN,AO WHERE (D = '" + statenames + "') AND (E = " + years + ") AND K > 0 ORDER BY A, E LIMIT 8";
        //tableStringContent[0] = "SELECT A,E,K,F,G,H,I,J WHERE (D = '" + statenames + "') AND (E = " + years + ") ORDER BY A, E";
        tableStringContent[0] = "SELECT A,E,K,AL,AM,AN,AO,AP WHERE (D = '" + statenames + "') AND (E = " + years + ") AND K > 0 ORDER BY A, E";
        sheetName[0] = 'sheet=x_dl_export_full&';
        reportHeading[0] = "Device Loans: Purpose of Loans";
        legendHTML = legendBuild(3);
        break;
        case '5':
        stringContent = "SELECT B,AQ,AR,AS,AT,AU,AV,AW,AX,AY,AZ WHERE (D = '" + statenames + "') AND (E = " + years + ") AND W > 0 ORDER BY A, E LIMIT 8";
        // tableStringContent[0] = "SELECT A,E,W,L,M,N,O,P,Q,R,S,T,U,V WHERE (D = '" + statenames + "') AND (E = " + years + ") ORDER BY A, E";
        tableStringContent[0] = "SELECT A,E,W,AQ,AR,AS,AT,AU,AV,AW,AX,AY,AZ,BA WHERE (D = '" + statenames + "') AND (E = " + years + ") AND W > 0 ORDER BY A, E";
        sheetName[0] = 'sheet=x_dl_export_full&';
        reportHeading[0] = "Device Loans: Type of AT";
        legendHTML = legendBuild(0);
        break;
        
        case '6':
        stringContent = "SELECT B,BB,BC,BD,BE,BF,BG,BH WHERE (D = '" + statenames + "') AND (E = " + years + ") AND AF > 0 ORDER BY A, E LIMIT 8";
        // tableStringContent[0] = "SELECT A,E,AF,X,Y,Z,AA,AB,AC,AD,AE WHERE (D = '" + statenames + "') AND (E = " + years + ") ORDER BY A, E";
        tableStringContent[0] = "SELECT A,E,AF,BB,BC,BD,BE,BF,BG,BH,BI WHERE (D = '" + statenames + "') AND (E = " + years + ") AND AF > 0 ORDER BY A, E, E";
        sheetName[0] = 'sheet=x_dl_export_full&';
        reportHeading[0] = "Device Loans: Device Borrowers";
        legendHTML = legendBuild(1);
        break;
        
        case '7':
        stringContent = "SELECT B,BJ,BK,BL,BM WHERE (D = '" + statenames + "') AND (E = " + years + ") AND AK > 0 ORDER BY A, E LIMIT 8";
        // tableStringContent[0] = "SELECT A,E,AK,AG,AH,AI,AJ WHERE (D = '" + statenames + "') AND (E = " + years + ") ORDER BY A, E";
        tableStringContent[0] = "SELECT A,E,AK,BJ,BK,BL,BM WHERE (D = '" + statenames + "') AND (E = " + years + ") AND AK > 0 ORDER BY A, E";
        sheetName[0] = 'sheet=x_dl_export_full&';
        reportHeading[0] = "Device Loans: Customer Satisfaction";
        legendHTML = legendBuild(2);
        break;
        
        case '8':
        stringContent = "SELECT B,AE,AF,AG,AH,AI,AJ,AK,AL,AM,AN WHERE (D = '" + statenames + "') AND (E = " + years + ") AND Q > 0 ORDER BY A, E LIMIT 8";
         // tableStringContent[0] = "SELECT A,E,Q,F,G,H,I,J,K,L,M,N,O,P WHERE (D = '" + statenames + "') AND (E = " + years + ") ORDER BY A, E";
        tableStringContent[0] = "SELECT A,E,Q,AE,AF,AG,AH,AI,AJ,AK,AL,AM,AN,AO WHERE (D = '" + statenames + "') AND (E = " + years + ") AND Q > 0 ORDER BY A, E";
        sheetName[0] = 'sheet=x_de_export_full&';
        reportHeading[0] = "Device Exchange: Type of AT";
        legendHTML = legendBuild(0);
        break;

        case '9':
        stringContent = "SELECT B,R,S,T,U,V,W,X,Y,Z,AA WHERE (D = '" + statenames + "') AND (E = " + years + ") AND AC > 0 ORDER BY A, E LIMIT 8";
        // tableStringContent[0] = "SELECT A,E,AC,R,S,T,U,V,W,X,Y,Z,AA,AB WHERE (D = '" + statenames + "') AND (E = " + years + ") ORDER BY A, E";
        tableStringContent[0] = "SELECT A,E,AC,R,S,T,U,V,W,X,Y,Z,AA,AB WHERE (D = '" + statenames + "') AND (E = " + years + ") AND AC > 0 ORDER BY A, E";
        sheetName[0] = 'sheet=x_de_export_full&';
        reportHeading[0] = "Device Exchange: Savings";
        legendHTML = legendBuild(0);
        break;

        case '10':
        stringContent = "SELECT B,AE,AF,AG,AH,AI,AJ,AK,AL,AM,AN WHERE (D = '" + statenames + "') AND (E = " + years + ") AND Q > 0 ORDER BY A, E LIMIT 8";
        // tableStringContent[0] = "SELECT A,E,Q,F,G,H,I,J,K,L,M,N,O,P WHERE (D = '" + statenames + "') AND (E = " + years + ") ORDER BY A, E";
        tableStringContent[0] = "SELECT A,E,Q,AE,AF,AG,AH,AI,AJ,AK,AL,AM,AN,AO WHERE (D = '" + statenames + "') AND (E = " + years + ") AND Q > 0 ORDER BY A, E";
        sheetName[0] = 'sheet=x_rrr_and_x_dr_sat_export_full&';
        reportHeading[0] = "Device Refurbishment: Type of AT";
        legendHTML = legendBuild(0);
        break;

        case '11':
        stringContent = "SELECT B,R,S,T,U,V,W,X,Y,Z,AA WHERE (D = '" + statenames + "') AND (E = " + years + ") AND AC > 0 ORDER BY A, E LIMIT 8";
        // tableStringContent[0] = "SELECT A,E,AC,R,S,T,U,V,W,X,Y,Z,AA,AB WHERE (D = '" + statenames + "') AND (E = " + years + ") ORDER BY A, E";
        tableStringContent[0] = "SELECT A,E,AC,R,S,T,U,V,W,X,Y,Z,AA,AB WHERE (D = '" + statenames + "') AND (E = " + years + ") AND AC > 0 ORDER BY A, E";
        sheetName[0] = 'sheet=x_rrr_and_x_dr_sat_export_full&';
        reportHeading[0] = "Device Refurbishment: Savings";
        legendHTML = legendBuild(0);
        break;

        case '12':
        stringContent = "SELECT B,AP,AQ,AR,AS WHERE (D = '" + statenames + "') AND (E = " + years + ") AND AX > 0 ORDER BY A, E LIMIT 8";
        // tableStringContent[0] = "SELECT A,E,AX,AT,AU,AV,AW WHERE (D = '" + statenames + "') AND (E = " + years + ") ORDER BY A, E";
        tableStringContent[0] = "SELECT A,E,AX,AP,AQ,AR,AS WHERE (D = '" + statenames + "') AND (E = " + years + ") AND AX > 0 ORDER BY A, E";
        sheetName[0] = 'sheet=x_rrr_and_x_dr_sat_export_full&';
        reportHeading[0] = "Device Reutilization: Customer Satisfaction";
        legendHTML = legendBuild(2);
        break;

        case '13':
        stringContent = "SELECT B,AG,AH,AI,AJ,AK,AL,AM,AN,AO,AP WHERE (D = '" + statenames + "') AND (E = " + years + ") AND Q > 0 ORDER BY A, E LIMIT 8";
        // tableStringContent[0] = "SELECT A,E,Q,F,G,H,I,J,K,L,M,N,O,P WHERE (D = '" + statenames + "') AND (E = " + years + ") ORDER BY A, E";
        tableStringContent[0] = "SELECT A,E,Q,AG,AH,AI,AJ,AK,AL,AM,AN,AO,AP,AQ WHERE (D = '" + statenames + "') AND (E = " + years + ") AND Q > 0 ORDER BY A, E";
        sheetName[0] = 'sheet=x_fl_export_full&';
        reportHeading[0] = "Financial Loans: Type of AT";
        legendHTML = legendBuild(0);
        break;

        case '14':
        stringContent = "SELECT B,R,S,T,U,V,W,X,Y,Z,AA WHERE (D = '" + statenames + "') AND (E = " + years + ") AND AC > 0 ORDER BY A, E LIMIT 8";
        // tableStringContent[0] = "SELECT A,E,AC,R,S,T,U,V,W,X,Y,Z,AA,AB WHERE (D = '" + statenames + "') AND (E = " + years + ") ORDER BY A, E";
        tableStringContent[0] = "SELECT A,E,AC,R,S,T,U,V,W,X,Y,Z,AA,AB WHERE (D = '" + statenames + "') AND (E = " + years + ") AND AC > 0 ORDER BY A, E";
        sheetName[0] = 'sheet=x_fl_export_full&';
        reportHeading[0] = "Financial Loans: Loan Value";
        legendHTML = legendBuild(0);
        break;
        
        case '15':
        stringContent = "SELECT B,AD,AF,AG,AH,AI,AJ,AK,AL,AM,AN WHERE (D = '" + statenames + "') AND (E = " + years + ") AND Q > 0 ORDER BY A, E LIMIT 8";
        // tableStringContent[0] = "SELECT A,E,Q,F,G,H,I,J,K,L,M,N,O,P WHERE (D = '" + statenames + "') AND (E = " + years + ") ORDER BY A, E";
        tableStringContent[0] = "SELECT A,E,Q,AE,AF,AG,AH,AI,AJ,AK,AL,AM,AN,AO WHERE (D = '" + statenames + "') AND (E = " + years + ") AND Q > 0 ORDER BY A, E";
        sheetName[0] = 'sheet=x_sf_export_full&';
        reportHeading[0] = "Other Financing: Type of AT";
        legendHTML = legendBuild(0);
        break;
        
        case '16':
        stringContent = "SELECT B,R,S,T,U,V,W,X,Y,Z,AA WHERE (D = '" + statenames + "') AND (E = " + years + ") AND AC > 0 ORDER BY A, E LIMIT 8";
        // tableStringContent[0] = "SELECT A,E,AC,R,S,T,U,V,W,X,Y,Z,AA,AB WHERE (D = '" + statenames + "') AND (E = " + years + ") ORDER BY A, E";
        tableStringContent[0] = "SELECT A,E,AC,R,S,T,U,V,W,X,Y,Z,AA,AB WHERE (D = '" + statenames + "') AND (E = " + years + ") AND AC > 0 ORDER BY A, E";
        sheetName[0] = 'sheet=x_sf_export_full&';
        reportHeading[0] = "Other Financing: Dollar Value";
        legendHTML = legendBuild(0);
        break;
        
        case '17':
        stringContent = "SELECT B,K,L,M,N WHERE (D = '" + statenames + "') AND (E = " + years + ") ORDER BY A, E LIMIT 8";
        // tableStringContent[0] = "SELECT A,E,J,F,G,H,I WHERE (D = '" + statenames + "') AND (E = " + years + ") ORDER BY A, E";
        tableStringContent[0] = "SELECT A,E,J,K,L,M,N WHERE (D = '" + statenames + "') AND (E = " + years + ") ORDER BY A, E";
        sheetName[0] = 'sheet=x_fa_sat_export_and_summaries&';
        reportHeading[0] = "State Financing Activities: Customer Satisfaction";
        legendHTML = legendBuild(2);
        break;
        
        case '18':
        stringContent = "SELECT B,AH,AI,AJ,AK,AL,AM,AN WHERE (D = '" + statenames + "') AND (E = " + years + ") ORDER BY A, E LIMIT 8";
        // tableStringContent[0] = "SELECT A,E,N,F,G,H,I,J,K,L,M WHERE (D = '" + statenames + "') AND (E = " + years + ") ORDER BY A, E";
        tableStringContent[0] = "SELECT A,E,N,AH,AI,AJ,AK,AL,AM,AN,AO WHERE (D = '" + statenames + "') AND (E = " + years + ") ORDER BY A, E";
        sheetName[0] = 'sheet=x_ia_export_full&';
        reportHeading[0] = "Information and Assistance: Recipients of AT Device/Service Content";
        legendHTML = legendBuild(1);
        break;
        
        case '19':
        stringContent = "SELECT B,AP,AQ,AR,AS,AT,AU,AV WHERE (D = '" + statenames + "') AND (E = " + years + ") ORDER BY A, E LIMIT 8";
        // tableStringContent[0] = "SELECT A,E,W,O,P,Q,R,S,T,U,V WHERE (D = '" + statenames + "') AND (E = " + years + ") ORDER BY A, E";
        tableStringContent[0] = "SELECT A,E,W,AP,AQ,AR,AS,AT,AU,AV,AW WHERE (D = '" + statenames + "') AND (E = " + years + ") ORDER BY A, E";
        sheetName[0] = 'sheet=x_ia_export_full&';
        reportHeading[0] = "Information and Assistance: Recipients of AT Funding Content";
        legendHTML = legendBuild(1);
        break;
        case '20':
        stringContent = "SELECT B,W,X,Y,Z,AA,AB,AC,AD,AE WHERE (D = '" + statenames + "') AND (E = " + years + ") ORDER BY A, E LIMIT 8";
        //tableStringContent[0] = "SELECT A,E,O,F,G,H,I,J,K,L,M,N WHERE (D = '" + statenames + "') AND (E = " + years + ") ORDER BY A, E";
        tableStringContent[0] = "SELECT A,E,O,W,X,Y,Z,AA,AB,AC,AD WHERE (D = '" + statenames + "') AND (E = " + years + ") ORDER BY A, E";
        sheetName[0] = 'sheet=x_tp_export_full&';
        reportHeading[0] = "Training: Participants";
        legendHTML = legendBuild(1);
        break;
        
        case '21':
        stringContent = "SELECT B,AF,AG,AH,AI,AJ WHERE (D = '" + statenames + "') AND (E = " + years + ") ORDER BY A, E LIMIT 8";
        // tableStringContent[0] = "SELECT  A,E,V,P,Q,R,S,T,U WHERE (D = '" + statenames + "') AND (E = " + years + ") ORDER BY A, E";
        tableStringContent[0] = "SELECT  A,E,V,AF,AG,AH,AI,AJ,AK WHERE (D = '" + statenames + "') AND (E = " + years + ") ORDER BY A, E";
        sheetName[0] = 'sheet=x_tp_export_full&';
        reportHeading[4] = "Training: Topics";

        break;
        
        case '22':
        stringContent = "SELECT B,AD,AE,AF,AG,AH,AI,AJ,AK,AL,AM WHERE (D = '" + statenames + "') AND (E = " + years + ") ORDER BY A, E LIMIT 8";
       tableStringContent[0] = "SELECT  A,E,Q,AD,AE,AF,AG,AH,AI,AJ,AK,AL,AM,AN WHERE (D = '" + statenames + "') AND (E = " + years + ") ORDER BY A, E";
        sheetName[0] = 'sheet=x_rc_export_full&';
        reportHeading[0] = "Financing that Reduces Cost: Type of AT";
        legendHTML = legendBuild(0);
        break;
        
        case '23':
        stringContent = "SELECT B,R,S,T,U,V,W,X,Y,Z,AA WHERE (D = '" + statenames + "') AND (E = " + years + ") ORDER BY A, E LIMIT 8";
        tableStringContent[0] = "SELECT  A,E,AC,R,S,T,U,V,W,X,Y,Z,AA,AB WHERE (D = '" + statenames + "') AND (E = " + years + ") ORDER BY A, E";
        sheetName[0] = 'sheet=x_rc_export_full&';
        reportHeading[0] = "Financing that Reduces Cost: Dollar Value of Savings";
        legendHTML = legendBuild(0);
        break;
        
        case '24':
        stringContent = null;
        //item 1
        tableStringContent[0] = "SELECT A,E,Q,AF,AG,AH,AI,AJ,AK,AL,AM,AN,AO,AP WHERE (D = '" + statenames + "') AND (E = " + years + ") ORDER BY A, E";
        sheetName[0] = 'sheet=x_dd_export_full&';
        reportHeading[0] = "Device Demonstrations: Type of AT";
        //item 2
        tableStringContent[1] = "SELECT A,E,Z,AQ,AR,AS,AT,AU,AV,AW,AX WHERE (D = '" + statenames + "') AND (E = " + years + ") ORDER BY A, E";
        sheetName[1] = 'sheet=x_dd_export_full&';
        reportHeading[1] = "Device Demonstrations: Participants";
        // item 3
        tableStringContent[2] = "SELECT A,E,AE,AY,AZ,BA,BB WHERE (D = '" + statenames + "') AND (E = " + years + ") ORDER BY A, E";
        sheetName[2] = 'sheet=x_dd_export_full&';
        reportHeading[2] = "Device Demonstrations: Customer Satisfaction";
        break;
        
        case '25':
        stringContent = null;
        // item 4
        tableStringContent[0] = "SELECT A,E,K,AL,AM,AN,AO,AP WHERE (D = '" + statenames + "') AND (E = " + years + ") ORDER BY A, E";
        sheetName[0] = 'sheet=x_dl_export_full&';
        reportHeading[0] = "Device Loans: Purpose of Loans";
        // item 5
        tableStringContent[1] = "SELECT A,E,W,AQ,AR,AS,AT,AU,AV,AW,AX,AY,AZ,BA WHERE (D = '" + statenames + "') AND (E = " + years + ") ORDER BY A, E";
        sheetName[1] = 'sheet=x_dl_export_full&';
        reportHeading[1] = "Device Loans: Type of AT";
        // item 6
        tableStringContent[2] = "SELECT A,E,AF,BB,BC,BD,BE,BF,BG,BH,BI WHERE (D = '" + statenames + "') AND (E = " + years + ") ORDER BY A, E";
        sheetName[2] = 'sheet=x_dl_export_full&';
        reportHeading[2] = "Device Loans: Device Borrowers";
        // item 7
        tableStringContent[3] = "SELECT A,E,AK,BJ,BK,BL,BM WHERE (D = '" + statenames + "') AND (E = " + years + ") ORDER BY A, E";
        sheetName[3] = 'sheet=x_dl_export_full&';
        reportHeading[3] = "Device Loans: Customer Satisfaction";
        break;
        
        case '26':
        stringContent = null;
        // item 8
        tableStringContent[0] = "SELECT A,E,Q,AE,AF,AG,AH,AI,AJ,AK,AL,AM,AN,AO WHERE (D = '" + statenames + "') AND (E = " + years + ") ORDER BY A, E";
        sheetName[0] = 'sheet=x_de_export_full&';
        reportHeading[0] = "Device Exchange: Type of AT";
        // item 9
        tableStringContent[1] = "SELECT A,E,AC,R,S,T,U,V,W,X,Y,Z,AA,AB WHERE (D = '" + statenames + "') AND (E = " + years + ") ORDER BY A, E";
        sheetName[1] = 'sheet=x_de_export_full&';
        reportHeading[1] = "Device Exchange: Savings";
        // item 10
        tableStringContent[2] = "SELECT A,E,Q,AE,AF,AG,AH,AI,AJ,AK,AL,AM,AN,AO WHERE (D = '" + statenames + "') AND (E = " + years + ") ORDER BY A, E"; 
        sheetName[2] = 'sheet=x_rrr_and_x_dr_sat_export_full&';
        reportHeading[2] = "Device Refurbishment: Type of AT";
        // item 11
        tableStringContent[3] = "SELECT A,E,AC,R,S,T,U,V,W,X,Y,Z,AA,AB WHERE (D = '" + statenames + "') AND (E = " + years + ") ORDER BY A, E";
        sheetName[3] = 'sheet=x_rrr_and_x_dr_sat_export_full&';
        reportHeading[3] = "Device Refurbishment: Savings";
        // item 12
        tableStringContent[4] = "SELECT A,E,AX,AP,AQ,AR,AS WHERE (D = '" + statenames + "') AND (E = " + years + ") ORDER BY A, E";
        sheetName[4] = 'sheet=x_rrr_and_x_dr_sat_export_full&';
        reportHeading[4] = "Device Reutilization: Customer Satisfaction";
        break;

        case '27':
        stringContent = null;
        // item 13
        tableStringContent[0] = "SELECT A,E,Q,AG,AH,AI,AJ,AK,AL,AM,AN,AO,AP,AQ WHERE (D = '" + statenames + "') AND (E = " + years + ") AND Q > 0 ORDER BY A, E";
        sheetName[0] = 'sheet=x_fl_export_full&';
        reportHeading[0] = "Financial Loans: Type of AT";
        //item 14
        tableStringContent[1] = "SELECT A,E,AC,R,S,T,U,V,W,X,Y,Z,AA,AB WHERE (D = '" + statenames + "') AND (E = " + years + ") ORDER BY A, E";
        sheetName[1] = 'sheet=x_fl_export_full&';
        reportHeading[1] = "Financial Loans: Loan Value";
        // item 15
        tableStringContent[2] = "SELECT A,E,Q,AE,AF,AG,AH,AI,AJ,AK,AL,AM,AN,AO WHERE (D = '" + statenames + "') AND (E = " + years + ") ORDER BY A, E";
        sheetName[2] = 'sheet=x_sf_export_full&';
        reportHeading[2] = "Other Financing: Type of AT";
        //item 16
        tableStringContent[3] = "SELECT A,E,AC,R,S,T,U,V,W,X,Y,Z,AA,AB WHERE (D = '" + statenames + "') AND (E = " + years + ") ORDER BY A, E";
        sheetName[3] = 'sheet=x_sf_export_full&';
        reportHeading[3] = "Other Financing: Dollar Value";
        //item 22
        tableStringContent[4] = "SELECT  A,E,Q,AD,AE,AF,AG,AH,AI,AJ,AK,AL,AM,AN WHERE (D = '" + statenames + "') AND (E = " + years + ") ORDER BY A, E";
        sheetName[4] = 'sheet=x_rc_export_full&';
        reportHeading[4] = "Financing that Reduces Cost: Type of AT";
        //item 23
        tableStringContent[5] = "SELECT  A,E,AC,R,S,T,U,V,W,X,Y,Z,AA,AB WHERE (D = '" + statenames + "') AND (E = " + years + ") ORDER BY A, E";
        sheetName[5] = 'sheet=x_rc_export_full&';
        reportHeading[5] = "Financing that Reduces Cost: Dollar Value of Savings";
        //item 17
        tableStringContent[6] = "SELECT A,E,J,K,L,M,N WHERE (D = '" + statenames + "') AND (E = " + years + ") ORDER BY A, E";
        sheetName[6] = 'sheet=x_fa_sat_export_and_summaries&';
        reportHeading[6] = "State Financing Activities: Customer Satisfaction";
        break;

        case '28':
        stringContent = null;
        //item 18
        tableStringContent[0] = "SELECT A,E,N,AH,AI,AJ,AK,AL,AM,AN,AO WHERE (D = '" + statenames + "') AND (E = " + years + ") ORDER BY A, E";
        sheetName[0] = 'sheet=x_ia_export_full&';
        reportHeading[0] = "Information and Assistance: Recipients of AT Device/Service Content";

        //item 19
        tableStringContent[1] = "SELECT A,E,W,AP,AQ,AR,AS,AT,AU,AV,AW WHERE (D = '" + statenames + "') AND (E = " + years + ") ORDER BY A, E";
        sheetName[1] = 'sheet=x_ia_export_full&';
        reportHeading[1] = "Information and Assistance: Recipients of AT Funding Content";
        break;

        case '29':
        stringContent = null;
        //item 20
        tableStringContent[0] = "SELECT A,E,O,W,X,Y,Z,AA,AB,AC,AD,AE WHERE (D = '" + statenames + "') AND (E = " + years + ") ORDER BY A, E";
        sheetName[0] = 'sheet=x_tp_export_full&';
        reportHeading[0] = "Training: Participants";

        //item 21
        tableStringContent[1] = "SELECT  A,E,V,AF,AG,AH,AI,AJ,AK WHERE (D = '" + statenames + "') AND (E = " + years + ") ORDER BY A, E";
        sheetName[1] = 'sheet=x_tp_export_full&';
        reportHeading[1] = "Training: Topics";
        break;


       

        case '30':
        stringContent = null;
        //item 1
        tableStringContent[0] = "SELECT A,E,Q,AF,AG,AH,AI,AJ,AK,AL,AM,AN,AO,AP WHERE (D = '" + statenames + "') AND (E = " + years + ") ORDER BY A, E";
        sheetName[0] = 'sheet=x_dd_export_full&';
        reportHeading[0] = "Device Demonstrations: Type of AT";
        //item 2
        tableStringContent[1] = "SELECT A,E,Z,AQ,AR,AS,AT,AU,AV,AW,AX WHERE (D = '" + statenames + "') AND (E = " + years + ") ORDER BY A, E";
        sheetName[1] = 'sheet=x_dd_export_full&';
        reportHeading[1] = "Device Demonstrations: Participants";
        // item 3
        tableStringContent[2] = "SELECT A,E,AE,AY,AZ,BA,BB WHERE (D = '" + statenames + "') AND (E = " + years + ") ORDER BY A, E";
        sheetName[2] = 'sheet=x_dd_export_full&';
        reportHeading[2] = "Device Demonstrations: Customer Satisfaction";
        // item 4
        tableStringContent[3] = "SELECT A,E,K,AL,AM,AN,AO,AP WHERE (D = '" + statenames + "') AND (E = " + years + ") ORDER BY A, E";
        sheetName[3] = 'sheet=x_dl_export_full&';
        reportHeading[3] = "Device Loans: Purpose of Loans";
        // item 5
        tableStringContent[4] = "SELECT A,E,W,AQ,AR,AS,AT,AU,AV,AW,AX,AY,AZ,BA WHERE (D = '" + statenames + "') AND (E = " + years + ") ORDER BY A, E";
        sheetName[4] = 'sheet=x_dl_export_full&';
        reportHeading[4] = "Device Loans: Type of AT";
        // item 6
        tableStringContent[5] = "SELECT A,E,AF,BB,BC,BD,BE,BF,BG,BH,BI WHERE (D = '" + statenames + "') AND (E = " + years + ") ORDER BY A, E";
        sheetName[5] = 'sheet=x_dl_export_full&';
        reportHeading[5] = "Device Loans: Device Borrowers";
        // item 7
        tableStringContent[6] = "SELECT A,E,AK,BJ,BK,BL,BM WHERE (D = '" + statenames + "') AND (E = " + years + ") ORDER BY A, E";
        sheetName[6] = 'sheet=x_dl_export_full&';
        reportHeading[6] = "Device Loans: Customer Satisfaction";
        // item 8
        tableStringContent[7] = "SELECT A,E,Q,AE,AF,AG,AH,AI,AJ,AK,AL,AM,AN,AO WHERE (D = '" + statenames + "') AND (E = " + years + ") ORDER BY A, E";
        sheetName[7] = 'sheet=x_de_export_full&';
        reportHeading[7] = "Device Exchange: Type of AT";
        // item 9
        tableStringContent[8] = "SELECT A,E,AC,R,S,T,U,V,W,X,Y,Z,AA,AB WHERE (D = '" + statenames + "') AND (E = " + years + ") ORDER BY A, E";
        sheetName[8] = 'sheet=x_de_export_full&';
        reportHeading[8] = "Device Exchange: Savings";
        // item 10
        tableStringContent[9] = "SELECT A,E,Q,AE,AF,AG,AH,AI,AJ,AK,AL,AM,AN,AO WHERE (D = '" + statenames + "') AND (E = " + years + ") ORDER BY A, E"; 
        sheetName[9] = 'sheet=x_rrr_and_x_dr_sat_export_full&';
        reportHeading[9] = "Device Refurbishment: Type of AT";
        // item 11
        tableStringContent[10] = "SELECT A,E,AC,R,S,T,U,V,W,X,Y,Z,AA,AB WHERE (D = '" + statenames + "') AND (E = " + years + ") ORDER BY A, E";
        sheetName[10] = 'sheet=x_rrr_and_x_dr_sat_export_full&';
        reportHeading[10] = "Device Refurbishment: Savings";
        // item 12
        tableStringContent[11] = "SELECT A,E,AX,AP,AQ,AR,AS WHERE (D = '" + statenames + "') AND (E = " + years + ") ORDER BY A, E";
        sheetName[11] = 'sheet=x_rrr_and_x_dr_sat_export_full&';
        reportHeading[11] = "Device Reutilization: Customer Satisfaction";
        // item 13
        tableStringContent[12] = "SELECT A,E,Q,AG,AH,AI,AJ,AK,AL,AM,AN,AO,AP,AQ WHERE (D = '" + statenames + "') AND (E = " + years + ") AND Q > 0 ORDER BY A, E";
        sheetName[12] = 'sheet=x_fl_export_full&';
        reportHeading[12] = "Financial Loans: Type of AT";
        //item 14
        tableStringContent[13] = "SELECT A,E,AC,R,S,T,U,V,W,X,Y,Z,AA,AB WHERE (D = '" + statenames + "') AND (E = " + years + ") ORDER BY A, E";
        sheetName[13] = 'sheet=x_fl_export_full&';
        reportHeading[13] = "Financial Loans: Loan Value";
        // item 15
        tableStringContent[14] = "SELECT A,E,Q,AE,AF,AG,AH,AI,AJ,AK,AL,AM,AN,AO WHERE (D = '" + statenames + "') AND (E = " + years + ") ORDER BY A, E";
        sheetName[14] = 'sheet=x_sf_export_full&';
        reportHeading[14] = "Other Financing: Type of AT";
        //item 16
        tableStringContent[15] = "SELECT A,E,AC,R,S,T,U,V,W,X,Y,Z,AA,AB WHERE (D = '" + statenames + "') AND (E = " + years + ") ORDER BY A, E";
        sheetName[15] = 'sheet=x_sf_export_full&';
        reportHeading[15] = "Other Financing: Dollar Value";
        //item 22
        tableStringContent[16] = "SELECT  A,E,Q,AD,AE,AF,AG,AH,AI,AJ,AK,AL,AM,AN WHERE (D = '" + statenames + "') AND (E = " + years + ") ORDER BY A, E";
        sheetName[16] = 'sheet=x_rc_export_full&';
        reportHeading[16] = "Financing that Reduces Cost: Type of AT";
        //item 23
        tableStringContent[17] = "SELECT  A,E,AC,R,S,T,U,V,W,X,Y,Z,AA,AB WHERE (D = '" + statenames + "') AND (E = " + years + ") ORDER BY A, E";
        sheetName[17] = 'sheet=x_rc_export_full&';
        reportHeading[17] = "Financing that Reduces Cost: Dollar Value of Savings";
        //item 17
        tableStringContent[18] = "SELECT A,E,J,K,L,M,N WHERE (D = '" + statenames + "') AND (E = " + years + ") ORDER BY A, E";
        sheetName[18] = 'sheet=x_fa_sat_export_and_summaries&';
        reportHeading[18] = "State Financing Activities: Customer Satisfaction";
        //item 18
        tableStringContent[19] = "SELECT A,E,N,AH,AI,AJ,AK,AL,AM,AN,AO WHERE (D = '" + statenames + "') AND (E = " + years + ") ORDER BY A, E";
        sheetName[19] = 'sheet=x_ia_export_full&';
        reportHeading[19] = "Information and Assistance: Recipients of AT Device/Service Content";

        //item 19
        tableStringContent[20] = "SELECT A,E,W,AP,AQ,AR,AS,AT,AU,AV,AW WHERE (D = '" + statenames + "') AND (E = " + years + ") ORDER BY A, E";
        sheetName[20] = 'sheet=x_ia_export_full&';
        reportHeading[20] = "Information and Assistance: Recipients of AT Funding Content";
        //item 20
        tableStringContent[21] = "SELECT A,E,O,W,X,Y,Z,AA,AB,AC,AD,AE WHERE (D = '" + statenames + "') AND (E = " + years + ") ORDER BY A, E";
        sheetName[21] = 'sheet=x_tp_export_full&';
        reportHeading[21] = "Training: Participants";

        //item 21
        tableStringContent[22] = "SELECT  A,E,V,AF,AG,AH,AI,AJ,AK WHERE (D = '" + statenames + "') AND (E = " + years + ") ORDER BY A, E";
        sheetName[22] = 'sheet=x_tp_export_full&';
        reportHeading[22] = "Training: Topics";
        break;




        // Summary tables
        case '31':
        stringContent = null;
        // device demonstrations
        tableStringContent[0] = "SELECT A,Q,Z,BC WHERE E = " + years + " ORDER BY C";
        sheetName[0] = 'sheet=x_dd_export_full&';
        reportHeading[0] = "Device Demonstrations: summary of programs";
        // device loans
        tableStringContent[1] = "SELECT A,K,W,BN WHERE E = " + years + " ORDER BY C";
        sheetName[1] = 'sheet=x_dl_export_full&';
        reportHeading[1] = "Device Loans: summary of programs";
        tableStringContent[2] = "SELECT A,O,P,Q,R,S WHERE E = " + years + " ORDER BY C";
        sheetName[2] = 'sheet=x_fa_sat_export_and_summaries&';
        reportHeading[2] = "Device Reutilization: summary of programs";
        tableStringContent[3] = "SELECT A,V,W,X,Y,Z,AA,AB WHERE E = " + years + " ORDER BY C";
        sheetName[3] = 'sheet=x_fa_sat_export_and_summaries&';
        reportHeading[3] = "State Financing: summary of programs";
        tableStringContent[4] = "SELECT A,T,U WHERE E = " + years + " ORDER BY C";
        sheetName[4] = 'sheet=x_fa_sat_export_and_summaries&';
        reportHeading[4] = "State Leadership: summary of activities";
        tableStringContent[5] = "SELECT A,F,G WHERE E = " + years + " ORDER BY C";
        sheetName[5] = 'sheet=x_ga_and_x_lf_export&';
        reportHeading[5] = "Federal and Leveraged Funding: summary";
        break;


      
        default:
        stringContent = "SELECT B,AF,AG,AH,AI,AJ,AK,AL,AM,AN,AO,AP WHERE (D = '" + statenames + "') AND (E = " + years + ") ORDER BY A, E LIMIT 8";
        tableStringContent[0] = "SELECT A,E,Q,F,G,H,I,J,K,L,M,N,O,P WHERE (D = '" + statenames + "') AND (E = " + years + ") ORDER BY A, E";
        sheetName[0] = 'sheet=x_dd_export_full&';
        reportHeading[0] = "Device Demonstrations: Type of AT";
        break;
    }
    var csvFileName = reportchoice == '31' ? reporttitle + '_for_' + yrsFilenm : reporttitle + '_in_' + statesFilenm + '_for_' + yrsFilenm;
    csvFileName = csvFileName.replace(/ /g,"_").replace( /,/g,"");
    
    if(stringContent) {
        var queryString = encodeURIComponent(stringContent);
        //console.log("CHART: " + chartURL + '/gviz/tq?' +  sheetName[i] + 'headers=1&tq=' + queryString);
        query = new google.visualization.Query( chartURL + '/gviz/tq?' +  sheetName[0] + 'headers=1&tq=' + queryString);
        query.send(handleChartDataQueryResponse);
        
    } 
    else 
    {
            jQuery('#chart_div').empty();
    }
    jQuery('.downloadButton h5.dlHeading').remove();
    if(jQuery('.clearable').hasClass('card-header')) jQuery('.clearable').removeClass('card-header');
    jQuery('.clearable').empty(); jQuery('#spreadDL').show()
    if (reportchoice == '30') jQuery('.downloadButton').prepend("<h5 class=\"dlHeading\">Download a spreadsheet with all categories for " + statenametext + " for " + yearstext + "</h5>"); else jQuery('.downloadButton').prepend("<h5 class=\"dlHeading\">Download results for " + statenametext + " for " + yearstext + "</h5>");
    for(i = 0;  i < tableStringContent.length; i++) {
        
        
       queryStringTable = encodeURIComponent(tableStringContent[i]);
        queryTable = new google.visualization.Query(chartURL + '/gviz/tq?' +  sheetName[i] + 'headers=1&tq=' + queryStringTable);
        

        
        
        //console.log("TABLE: I " + i +" " + chartURL + '/gviz/tq?' +  sheetName[i] + 'headers=1&tq=' + queryStringTable);
       
        doQuery(queryTable, i,reportHeading[i],reportchoice);
        
       jQuery('#csvDL #urlInputs').append('<input type="hidden" name="sendString[]" value="' + queryStringTable + '" />');
       jQuery('#csvDL #titleInputs').append((reportchoice == '31' ? '<input type="hidden" name="sendTitle[]" value="' + reportHeading[i] + ' for ' + yearstext + '" />' : '<input type="hidden" name="sendTitle[]" value="' + reportHeading[i] + ' in ' + statenametext + ' for ' + yearstext + '" />'));
       jQuery('#csvDL #sheetnameInputs').append('<input type="hidden" name="sendSheetname[]" value="' + sheetName[i] + '" />');
    }
    //var toolbarChart = handleToolbarDataQueryResponse(chartURL + '/gviz/tq?' +  sheetName + 'headers=1&tq=' + queryString);
    var csvReqString = '&tqx=reqId:1;out:csv;outFileName:' + csvFileName + '.csv';
    //jQuery("a#chartCSVlink").attr("href", chartURL + '/gviz/tq?' +  sheetName[i] + 'headers=1&tq=' + queryString + csvReqString);
    jQuery("a#tableCSVlink").attr("href", chartURL + '/gviz/tq?' + sheetName[i] + 'headers=1&tq=' + queryStringTable + csvReqString);
    //console.log(chartURL + '/gviz/tq?' + sheetName[0] + 'headers=1&tq=' + queryStringTable + csvReqString);
    } else if (countChecks('state') == 0 && countChecks('year') != 0 && jQuery('input[name="reportChoose"]:checked').val() != '31') {jQuery('.clearable').empty(); jQuery('#chart_div > div').remove(); jQuery('#legend_div').empty(); jQuery('#spreadDL').hide(); jQuery('.selectWarn').remove();
        jQuery('#chart_div').prepend('<h5 class="clearable selectWarn">Please choose one or more states above.</h5>'); jQuery('#chart_div > div').remove(); jQuery('input#spreadDL').hide();
    } else if (countChecks('state') != 0 && countChecks('year') == 0 && jQuery('input[name="reportChoose"]:checked').val() != '31') {jQuery('.clearable').empty(); jQuery('#chart_div > div').remove(); jQuery('#legend_div').empty(); jQuery('#spreadDL').hide();jQuery('.selectWarn').remove();
        jQuery('#chart_div').prepend('<h5 class="clearable selectWarn">Please choose one or more years above.</h5>'); jQuery('#chart_div > div').remove(); jQuery('input#spreadDL').hide();
    }  else if (countChecks('state') == 0 && countChecks('year') == 0  && jQuery('input[name="reportChoose"]:checked').val() != '31') {jQuery('.clearable').empty(); jQuery('#chart_div > div').remove(); jQuery('#legend_div').empty(); jQuery('#spreadDL').hide();jQuery('.selectWarn').remove();
    jQuery('#chart_div').prepend('<h5 class="clearable selectWarn">Please choose a category at left, and one or more years, and one or more states above.</h5>'); jQuery('#chart_div > div').remove(); jQuery('input#spreadDL').hide();
    }  else if (jQuery('input[name="reportChoose"]:checked').val() == '31' && !jQuery('input[name="summChoose"]:checked').val()) {jQuery('.clearable').empty(); jQuery('#chart_div > div').remove(); jQuery('#legend_div').empty(); jQuery('#spreadDL').hide(); jQuery('.selectWarn').remove();
    jQuery('#chart_div').prepend('<h5 class="clearable selectWarn">Please a year above for your summary report.</h5>'); jQuery('#chart_div > div').remove(); jQuery('input#spreadDL').hide();
    }

}
function handleChartDataQueryResponse(response) {
    if (response.isError()) {
          alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
          return;
    }
   
    var data = response.getDataTable();
    checkCount = countChecks();
    chartHeight = checkCount > 3 ? (checkCount > 5 ? '500':'450'): '175';
    areaHeight = checkCount > 3 ? (checkCount > 5 ? '650':'600'): '300';
    var groupWid = checkCount > 3 ? (checkCount > 5 ? '22':'32') : '22';
    reportchoice= jQuery('input[name="reportChoose"]:checked').val();
    var container = document.getElementById('chart_div');
    formatVAxis = reportchoice != '14' && reportchoice != '16' && reportchoice != '9' && reportchoice != '11' && reportchoice != '23' ? "#%" : "$#,###";
    var chart = new google.visualization.BarChart(container);
    var observer = new MutationObserver(function (mutations) {

        jQuery('rect[fill="#3366cc"],rect[fill="#b82e2e"],rect[fill="#ff9900"],rect[fill="#109618"],rect[fill="#990099"],rect[fill="#0099c6"],rect[fill="#dd4477"],rect[fill="#66aa00"], rect[fill="#dc3912"],rect[fill="#316395"]').each(function(i, obj) {

            rectWid = jQuery(this).attr('width');
            rectHeight = jQuery(this).attr('height');
           
            jQuery(this).attr('stroke-dasharray', rectWid + ',' + rectHeight);
            
        });
       
        jQuery('rect[fill="#3366cc"]').attr('stroke', '#000000');
        jQuery('rect[fill="#3366cc"]').attr('stroke-width', '4');
        jQuery('rect[fill="#b82e2e"]').attr('stroke', '#b82e2e');
        jQuery('rect[fill="#b82e2e"]').attr('stroke-width', '4');
        jQuery('rect[fill="#ff9900"]').attr('stroke', '#ff9900');
        jQuery('rect[fill="#ff9900"]').attr('stroke-width', '4');
        jQuery('rect[fill="#109618"]').attr('stroke', '#109618');
        jQuery('rect[fill="#109618"]').attr('stroke-width', '4');
        jQuery('rect[fill="#990099"]').attr('stroke', '#990099');
        jQuery('rect[fill="#990099"]').attr('stroke-width', '4');
        jQuery('rect[fill="#0099c6"]').attr('stroke', '#0099c6');
        jQuery('rect[fill="#0099c6"]').attr('stroke-width', '4');
        jQuery('rect[fill="#dd4477"]').attr('stroke', '#dd4477');
        jQuery('rect[fill="#dd4477"]').attr('stroke-width', '4');
        jQuery('rect[fill="#66aa00"]').attr('stroke', '#66aa00');
        jQuery('rect[fill="#66aa00"]').attr('stroke-width', '4');
        jQuery('rect[fill="#dc3912"]').attr('stroke', '#000000');
        jQuery('rect[fill="#dc3912"]').attr('stroke-width', '4');
        jQuery('rect[fill="#316395"]').attr('stroke', '#316395');
        jQuery('rect[fill="#316395"]').attr('stroke-width', '4');
      });
      observer.observe(container, {
        childList: true,
        subtree: true
    });



       
    chart.draw(data, {hAxis: {format: formatVAxis}, chartArea:{left:160,/*width:1000,*/height:chartHeight,top: 75},  legend: {
            maxLines: 2,
            position: "none",
            textStyle: {
              fontSize: 13
            }
        },'height':areaHeight,/*'width': 1400,*/'title': reportHeading[0] + ' in ' + statenametext + ' for ' + yearstext,bar: { groupWidth: groupWid},isStacked: true,colors: ['#b82e2e','#3366cc', '#ff9900','#109618' ,'#990099', '#0099c6' , '#dd4477' ,'#66aa00' ,'#dc3912' , '#316395']});
    jQuery('#legend_div').append(legendHTML);
}

function doQuery(q,i,reportHeader,reportchoice) {
    
    var tableTarget = 'table_div_' + i;
    var tableTitleTarget = 'table_div_' + i + '_title';
    if(reportchoice == '31') {
        jQuery('#' + tableTitleTarget).attr('data-target',tableTarget).addClass('card-header clearable').append('<h5><button class="btn btn-link collapsed" data-toggle="collapse" data-target="#' + tableTarget + '" aria-expanded="false" aria-controls="' + tableTarget + '"><strong>' + reportHeader + (reportchoice == '30' ?' in ' + statenametext : '') + ' for ' + yearstext + '</strong></button></h5>' ); 
        if(!jQuery('#' + tableTarget).hasClass('collapse'))jQuery('#' + tableTarget).addClass('collapse'); jQuery('#' + tableTarget).attr('aria-labelledby',tableTitleTarget).attr('data-parent','#sum_accordion').attr('aria-expanded',false);
    
    } else if (reportchoice == '30'){
        return;
    } else {
            jQuery('#' + tableTitleTarget).append('<h5><strong>' + reportHeader + ' in ' + statenametext + ' for ' + yearstext + '</strong></h5>');
            if(jQuery('#' + tableTarget).hasClass('collapse'))jQuery('#' + tableTarget).removeClass('collapse'); jQuery('#' + tableTarget).attr('aria-labelledby',tableTitleTarget).attr('data-parent','#sum_accordion').attr('aria-expanded',true);
        
        }
    q.send( function(response) {
        var data = response.getDataTable();
         var dataView = new google.visualization.DataView(data);
        var numrows = dataView.getNumberOfRows();
        console.log("Numrows: " + numrows);
        if (numrows === 0 && i=== 0) {
            jQuery('#chart_div').prepend('<h5>Your query produced no results.  Try again.</h5>');
            jQuery('#' + tableTitleTarget + ' h5').remove(); jQuery('#chart_div > div').remove(); jQuery('#legend_div').empty(); jQuery('#spreadDL').hide();
             return; 
        }
        data.setProperty(0, 0, 'style', 'width:100px');
       if (reportchoice != '30') { var table = new google.visualization.Table(
            document.getElementById(tableTarget));
            table.draw(data, {
            showRowNumber: false,
            allowHtml: true
        });
        }
        

      
    });
    
    
   

 }

/* not doing anything
$(window).resize(function(){
  drawChart();
}); */