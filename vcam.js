const exec = require('child_process').exec;
// sudo modprobe v4l2loopback
exec('sudo ffmpeg -loop 1 -re -i img1.jpg -f v4l2 -vcodec rawvideo -pix_fmt yuv420p /dev/video0',
	(error, stdout, stderr) => {
		console.log(`stdout: ${stdout}`);
		console.log(`stderr: ${stderr}`);
		if (error !== null) {
		    console.log(`exec error: ${error}`);
		    }
		}
);
