var Q = require('q');
var util = require('util');

var exec = require('process-promises').exec;

var generate_nest_stream = function(stream_url) {
    var destination_folder = "./streams";
    var file_name = "stream.mp3";
    //https://stream-ire-bravo.dropcam.com/nexus_aac/018e9b0cea844b5c9cc8ced5d324814b/index.m3u8

    var registration_time_in_sec = 30;

    var ffmpeg_command_line_format = "ffmpeg -i %s -t %d -y -vn %s";
    var ffmpeg_command_line = util.format(ffmpeg_command_line_format, stream_url, registration_time_in_sec, destination_folder + '/' + file_name);
    //var vlc_command_line_format = "cvlc --sout \"#transcode{acodec=mp3,ab=128,channels=2,samplerate=44100}:std{access=file,mux=raw,dst=%s}\" %s --run-time %d vlc://quit 2> /dev/null";

    console.log(ffmpeg_command_line);

    return exec(ffmpeg_command_line).then(function(result) {
        var deferred = Q.defer();
        console.log(result.stdout);
        deferred.resolve(destination_folder + '/' + file_name);

        return deferred.promise;
    }).catch(function(error) {
        var deferred = Q.defer();
        console.log('exec error: ', error);
        deferred.reject(destination_folder + '/' + file_name);

        return deferred.promise;
    });
};


module.exports = {
    generate_stream: generate_nest_stream
};
