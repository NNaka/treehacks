queue()
    .defer(d3.json, "/api/data")
    .await(makeGraphs);

function makeGraphs(error, apiData) {
	
//Start Transformations
	var dataSet = apiData;
	var dateFormat = d3.time.format("%m/%d/%Y");
	dataSet.forEach(function(d) {
		d.date = dateFormat.parse(d.date);
		d.date.setDate(1);
		// d.total_donations = +d.total_donations;
        if (d.progress > 16){
            d.progress = "Completed";
        } else if (d.progress > 8) {
            d.progress = "Halfway";
        } else {
            d.progress = "Begin";
        }
	});

	//Create a Crossfilter instance
	var ndx = crossfilter(dataSet);

	//Define Dimensions
	var datePosted = ndx.dimension(function(d) { return d.date; });
	var mentalScore = ndx.dimension(function(d) { return d.mental_score; });
	var gender = ndx.dimension(function(d) { return d.gender; });
	var progress = ndx.dimension(function(d) { return d.progress; });
	var completion = ndx.dimension(function(d) { return d.completion; });
	var gameName = ndx.dimension(function(d) { return d.game_name; });
	var mentalState  = ndx.dimension(function(d) { return d.mental_state; });

	//Calculate metrics
	var projectsByDate = datePosted.group(); 
	var projectsByMentalScore = mentalScore.group(); 
    var projectsByMentalState = mentalState.group();
	var projectsByGender = gender.group();
	var projectsByProgress = progress.group();
	var projectsByCompletion = completion.group();
	var gameNameGroup = gameName.group();

	var all = ndx.groupAll();

	//Calculate Groups
	var totalMentalState = mentalState.group().reduceSum(function(d) {
		return d.mental_state;
	});

	var totalMentalScore = mentalScore.group().reduceSum(function(d) {
		return d.mental_score;
	});

	var totalProgress = progress.group().reduceSum(function(d) {
		return d.progress;
	});

	var netTotalDonations = ndx.groupAll().reduceSum(function(d) {return d.mental_state;});

	//Define threshold values for data
	var minDate = datePosted.bottom(1)[0].date;
	var maxDate = datePosted.top(1)[0].date;

console.log(minDate);
console.log(maxDate);

    //Charts
	var dateChart = dc.lineChart("#date-chart");
	var mentalScoreChart = dc.rowChart("#mental-score-chart");
    var mentalStateChart = dc.rowChart("#mental-state-chart");
	var genderChart = dc.rowChart("#gender-chart");
	var progressChart = dc.pieChart("#progress-chart");
	// var completionChart = dc.rowChart("#completion-chart");
	var totalProjects = dc.numberDisplay("#total-projects");
	var totalSteps = dc.numberDisplay("#total-steps");
	var completionChart = dc.barChart("#completion");


  selectField = dc.selectMenu('#menuselect')
        .dimension(gameName)
        .group(gameNameGroup); 

       dc.dataCount("#row-selection")
        .dimension(ndx)
        .group(all);


	totalProjects
		.formatNumber(d3.format("d"))
		.valueAccessor(function(d){return d; })
		.group(all);

	totalSteps
		.formatNumber(d3.format("d"))
		.valueAccessor(function(d){return d; })
		.group(projectsByCompletion)
		.formatNumber(d3.format(".3s"));

	dateChart
		//.width(600)
		.height(220)
		.margins({top: 10, right: 50, bottom: 30, left: 50})
		.dimension(datePosted)
		.group(projectsByDate)
		.renderArea(true)
		.transitionDuration(500)
		.x(d3.time.scale().domain([minDate, maxDate]))
		.elasticY(true)
		.renderHorizontalGridLines(true)
    	.renderVerticalGridLines(true)
		.xAxisLabel("Year")
		.yAxis().ticks(6);

	genderChart
        //.width(300)
        .height(220)
        .dimension(gender)
        .group(projectsByGender)
        .elasticX(true)
        .xAxis().ticks(5);

	// completionChart
	// 	//.width(300)
	// 	.height(220)
 //        .dimension(completion)
 //        .group(projectsByCompletion)
 //        .xAxis().ticks(4);

	mentalScoreChart
		//.width(300)
		.height(220)
        .dimension(mentalScore)
        .group(projectsByMentalScore)
        .xAxis().ticks(4);

    mentalStateChart
        //.width(300)
        .height(220)
        .dimension(mentalState)
        .group(projectsByMentalState)
        .xAxis().ticks(4);

      progressChart
        .height(220)
        //.width(350)
        .radius(90)
        .innerRadius(40)
        .transitionDuration(1000)
        .dimension(progress)
        .group(projectsByProgress);


    completionChart
    	//.width(800)
        .height(220)
        .transitionDuration(1000)
        .dimension(completion)
        .group(gameNameGroup)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .centerBar(false)
        .gap(5)
        .elasticY(true)
        .x(d3.scale.ordinal().domain(completion))
        .xUnits(dc.units.ordinal)
        .renderHorizontalGridLines(true)
        .renderVerticalGridLines(true)
        .ordering(function(d){return d.value;})
        .yAxis().tickFormat(d3.format("s"));


    dc.renderAll();

};
