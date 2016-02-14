queue()
    .defer(d3.json, "/api/data")
    .await(makeGraphs);

function makeGraphs(error, apiData) {
	
//Start Transformations
	var dataSet = apiData;
	var dateFormat = d3.time.format("%m/%d/%Y");
	dataSet.forEach(function(d) {
		d.date_posted = dateFormat.parse(d.date_posted);
				d.date_posted.setDate(1);
		d.total_donations = +d.total_donations;
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
	var projectsByResourceType = gender.group();
	var projectsByFundingStatus = progress.group();
	var projectsByPovertyLevel = completion.group();
	var gameNameGroup = game_name.group();

	var all = ndx.groupAll();

	//Calculate Groups
	var totalMentalState = state.group().reduceSum(function(d) {
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
	var minDate = datePosted.bottom(1)[0].date_posted;
	var maxDate = datePosted.top(1)[0].date_posted;

console.log(minDate);
console.log(maxDate);

    //Charts
	var dateChart = dc.lineChart("#date-chart");
	var mentalScoreChart = dc.rowChart("#mental_score-chart");
	var genderChart = dc.rowChart("#gender-chart");
	var progressChart = dc.pieChart("#progress-chart");
	var completionChart = dc.rowChart("#completion-chart");
	var totalProjects = dc.numberDisplay("#total-projects");
	var netDonations = dc.numberDisplay("#net-donations");
	var stateDonations = dc.barChart("#state-donations");


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

	netDonations
		.formatNumber(d3.format("d"))
		.valueAccessor(function(d){return d; })
		.group(netTotalDonations)
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
        .group(projectsByResourceType)
        .elasticX(true)
        .xAxis().ticks(5);

	completionChart
		//.width(300)
		.height(220)
        .dimension(completion)
        .group(projectsByPovertyLevel)
        .xAxis().ticks(4);

	gradeLevelChart
		//.width(300)
		.height(220)
        .dimension(mentalScore)
        .group(projectsByMentalScore)
        .xAxis().ticks(4);

  
          progressChart
            .height(220)
            //.width(350)
            .radius(90)
            .innerRadius(40)
            .transitionDuration(1000)
            .dimension(progress)
            .group(projectsByFundingStatus);


    stateDonations
    	//.width(800)
        .height(220)
        .transitionDuration(1000)
        .dimension(gameName)
        .group(totalMentalState)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .centerBar(false)
        .gap(5)
        .elasticY(true)
        .x(d3.scale.ordinal().domain(gameName))
        .xUnits(dc.units.ordinal)
        .renderHorizontalGridLines(true)
        .renderVerticalGridLines(true)
        .ordering(function(d){return d.value;})
        .yAxis().tickFormat(d3.format("s"));


    dc.renderAll();

};
