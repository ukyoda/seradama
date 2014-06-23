#!/bin/sh

forever start -l /home/seradama/seradama/log/forever_`date +%Y%m%d%H%M%S`.log -o /home/seradama/seradama/log/stdout_`date +%Y%m%d%H%M%S`.log -e /home/seradama/seradama/log/stderr_`date +%Y%m%d%H%M%S`.log bin/www
