# jquery-levelup
Simple +1/-1 Animation similar to point accumulation in a video game.

_This is my first jquery plugin, and it's definitely under construction.  So check back for regular updates and feel free to make suggestions._

Plans
-----

1. Allow it to accept formatting for the indicator.
2. It is presently always adding a span element, assuming the accumulator is a span, it could attempt to mimic that value's HTML DOM type

Usage
-----
```html
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
<script src="/libs/jquery-follow-cursor/follow-cursor.js"></script>

<canvas id='eye' height="220" width="220"></canvas>

<script>
    $('#eye').followCursor();
</script>
```

License
-------
[Apache License 2.0](http://www.apache.org/licenses/LICENSE-2.0)
