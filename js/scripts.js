let transitioning = false;

$('document').on('ready',function(){
    Particles.init({
        maxParicles: 3,
        sizeVariations: 3,
        selector: '.background',
        color: ['#888888'],
        speed: 0.25,
        connectParticles: true
    })
})

$('body:not(.transitioning)').on('mousewheel',function(e){
    let cS = $('section:visible'),
        nS = $(cS).next('section'),
        pS = $(cS).prev('section');

    if( e.originalEvent.deltaY > 0 && nS.length ){
        $('body').addClass('transitioning')
        $(cS).fadeOut(750,function(){
            $(nS).fadeIn(750,function(){
                $('body').removeClass('transitioning')
            })
        })
    }
    if( e.originalEvent.deltaY < 0 && pS.length ){
        $('body').addClass('transitioning')
        $(cS).fadeOut(750,function(){
            $(pS).fadeIn(750,function(){
                $('body').removeClass('transitioning')
            })
        })
    }
});