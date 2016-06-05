# jquery-levelup
Simple +1/-1 Animation similar to point accumulation in a video game.

_This is my first jquery plugin, and it's definitely under construction.  So check back for regular updates and feel free to make suggestions._

Plans
-----

1. Make it not always use a bolded font for the indicator.
2. Allow it to accept parameters for colorization of indicator.
3. Allow it to accept formatting for the indicator.

Usage
-----
```html
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
<script src="/libs/jquery-levelup/levelup.js"></script>

<span>select <span style="font-weight: bold;" id='twitter_cnt'>0</span></span>

<script>
    $('#twitter_cnt').levelup({'start' : 0});

    $('#incrementBtn').on('click', function(event) {
        $('#twitter_cnt').levelup('increment', 1);
        $(this).blur();
    });
    $('#decrementBtn').on('click', function(event) {
        $('#twitter_cnt').levelup('decrement', 1);
        $(this).blur();
    });
</script>
```

Options
-------
You should specify options like in usage example above.

| Option  | Description |
| ---- | ---- | ---- |
| start | Start value for span. <br> Default: `0` |

