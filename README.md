# jquery-levelup
Simple +1/-1 Animation similar to point accumulation in a video game.

Plans
-----

See issues.

Usage
-----
```html
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
<script src="/libs/jquery-levelup/levelup.js"></script>

<span>counter <span style="font-weight: bold;" id='the_cnt'>0</span></span>

<script>
    var $tc = $('#the_cnt');
    $tc.levelup({'start' : 0});

    $('#incrementBtn').on('click', function(event) {
        $tc.levelup('increment', 1);
        $(this).blur();
    });
    $('#decrementBtn').on('click', function(event) {
        $tc.levelup('decrement', 1);
        $(this).blur();
    });
</script>
```

Options
-------
You should specify options like in usage example above.

| Name | Type | Default | Description |
| ---- | ---- | ---- | ---- |
| start | integer | `0` | Start value for span. |
| incrementer/decrementer.bold | boolean | true | Whether the incrementer|decrementer is bold |
| incrementer/decrementer.color | CSS color string | null | Change the incrementer|decrementer's text color |
| incrementer/decrementer.class | string | null | Add a class to the incrementer|decrementer element |

| Methods  | Params |
| ---- | ---- | ---- |
| `increment` | integer by which to increment |
| `decrement` | absolute value of integer by which to decrement (always positive) |

License
-------
[Apache License 2.0](http://www.apache.org/licenses/LICENSE-2.0)
