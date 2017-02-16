
CustomValidator = {
	validator: function(str) {
		return !regExp.test(str);
	},
	message: '{VALUE} is not allow special character!'
}

var regExpForStacktrace = /[\{\}\[\]?,;:|*~`!^+<>@\#$%&\=]/gi
var StacktraceValidator = {
	validator: function(str) {
		return !regExpForStacktrace.test(str);
	},
	message: '{VALUE} is not allow special character!'
}

module.exports.resHeaderSchema = {
	launch_time : { type : Number }, // milliseconds
	dump_interval : { type : Number },
	package_name : { 
		type : String,
		trim : true,
		validate:  CustomValidator },
	device_info : {
		os : { type: String,
			trim : true,
			validate:  CustomValidator },
		app : { type: String,
			trim : true,
			validate:  CustomValidator },
		device : { type: String,
			trim : true,
			validate:  CustomValidator },
		brand : { type: String,
			trim : true,
			validate:  CustomValidator },
		UUID : { type: String,
			trim : true,
			validate:  CustomValidator }
	},
	data : []
}

module.exports.resSchema = {
	type : { 
		type: String,
		trim : true,
		validate:  CustomValidator },
	// Shallow
	duration_time : {
		start : { type : Number },
		end : { type : Number }
	},
	os: {
        cpu: {
          user: { type : Number },
          nice: { type : Number },
          system: { type : Number },
          idle: { type : Number },
          iowait: { type : Number },
          irq: { type : Number },
          softirq: { type : Number },
          steal: { type : Number },
          guest: { type : Number },
          guest_nice: { type : Number }
        },
        vmstat: {
          r: { type : Number },
          b: { type : Number },
          swpd: { type : Number },
          free: { type : Number },
          buff: { type : Number },
          cache: { type : Number },
          si: { type : Number },
          so: { type : Number },
          bi: { type : Number },
          bo: { type : Number },
          in: { type : Number },
          cs: { type : Number },
          us: { type : Number },
          sy: { type : Number },
          id: { type : Number },
          wa: { type : Number }
        },
        battery : { type : Number },
		network_usage : {
			name : { type: String,
				trim : true,
				validate:  CustomValidator }, // or "WIFI" or ""
			rx : { type : Number },
			tx : { type : Number }
		}
      },
      app: {
        cpu_app: {
          state: { type: String,
				trim : true,
				validate:  CustomValidator },
          ppid: { type : Number },
          pgrp: { type : Number },
          session: { type : Number },
          tty_nr: { type : Number },
          tpgid: { type : Number },
          flags: { type : Number },
          minflt: { type : Number },
          cminfltmajflt: { type : Number },
          cmajflt: { type : Number },
          utime: { type : Number },
          stime: { type : Number },
          cutime: { type : Number },
          cstime: { type : Number },
          priority: { type : Number },
          nice: { type : Number },
          num_threadsitrealvalue: { type : Number },
          starttime: { type : Number },
          vsize: { type : Number },
          rss_: { type : Number },
          rsslim: { type : Number },
          startcode: { type : Number },
          endcode: { type : Number },
          startstackkstkesp: { type : Number },
          kstkeip: { type : Number },
          signal: { type : Number },
          blocked: { type : Number },
          sigignore: { type : Number },
          sigcatch: { type : Number },
          wchan: { type : Number },
          nswap: { type : Number },
          cnswapexit_signal: { type : Number },
          processor: { type : Number },
          rt_priority: { type : Number },
          policy: { type : Number },
          dly_io_tic: { type : Number },
          guest_timecguest_time: { type : Number },
          start_data: { type : Number },
          enddata: { type : Number },
          str_brk: { type : Number },
          arg_str: { type : Number },
          arg_end: { type : Number },
          env_strenv_end: { type : Number },
          ext_cod: { type : Number }
        },
        memory : {
			max : { type : Number },
			total : { type : Number },
			alloc : { type : Number },
			free : { type : Number }
		},
		activity_stack : [String],
		
		thread_trace : [{
			type : String,
			trim : true,
			validate : CustomValidator }]
	}
};

module.exports.renderSchema = {
	type : {
		type : String,
		trim : true,
		validate : CustomValidator },
	activity_name : {
		type : String,
		trim : true,
		validate : CustomValidator },
	lifecycle_name : {
		type : String,
		trim : true,
		validate : CustomValidator },
	callback_time : { type : Number } // milliseconds
};

module.exports.crashSchema = {
	type : { 
		type: String,
		trim : true,
		validate:  CustomValidator },
	crash_time : { type : Number }, // milliseconds
	stacktrace : { 
		type: String,
		trim : true,
		validate:  StacktraceValidator }
};

module.exports.requestSchema = {
	type : { 
		type: String,
		trim : true,
		validate:  CustomValidator },
	request_time : { type : Number }, // milliseconds
	host : { 
		type: String,
		trim : true,
		validate:  CustomValidator },
	response_time : { type : Number } // milliseconds
};

module.exports.clickSchema = {
	type : { 
		type: String,
		trim : true,
		validate:  CustomValidator },
	location : { 
		type: String,
		trim : true,
		validate:  CustomValidator },
	x : { type : Number },
	y : { type : Number }
};
