$(document).ready(async function() {    
    const deckResponse = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
    const deckData = await deckResponse.json();
    const drawResponse = await fetch(`https://deckofcardsapi.com/api/deck/${deckData.deck_id}/draw/?count=3`);
    const cardsData = await drawResponse.json();
    const cards = cardsData.cards;

    cards.sort(() => Math.random() - 0.5);

    const targetCard = cards[Math.floor(Math.random() * cards.length)];
    $('#target-card').html(`
        <img src="${targetCard.image}" alt="Target Card" class="target-card-img img-fluid rounded shadow">
    `);

    const cardContainer = $('#card-container');
    cards.forEach((card) => {
        cardContainer.append(`
            <div class="col-md-4 mb-4">
                <div class="flip-box" data-card-code="${card.code}">
                    <div class="flip-box-inner">
                        <div class="flip-box-front">
                            <img src="https://deckofcardsapi.com/static/img/back.png" alt="Card Back" class="img-fluid">
                        </div>
                        <div class="flip-box-back">
                            <img src="${card.image}" alt="${card.value} of ${card.suit}" class="img-fluid">
                        </div>
                    </div>
                </div>
            </div>
        `);
    });

    let hasGuessed = false;

    $('.flip-box').click(function() {
        if (hasGuessed) return;
        $(this).addClass('flipped');
        hasGuessed = true;

        const isCorrect = $(this).data('card-code') === targetCard.code;
        const result = $('#result');

        if (isCorrect) {
            result.html('🎉 Correct! Well done! 🌸').css('color', 'green');
        } else {
            result.html('❌ Wrong! The correct card will be revealed in 2 seconds!')
                  .css('color', 'red').addClass('shake');
            setTimeout(() => result.removeClass('shake'), 500);

            // Reveal the correct card after 2 seconds
            setTimeout(() => {
                $('.flip-box').each(function() {
                    if ($(this).data('card-code') === targetCard.code) {
                        $(this).addClass('flipped');
                    }
                });
            }, 2000);
        }

        // Shift all cards slightly to the right after guessing
        $('.flip-box').each(function(index) {
            $(this).css({
                'transform': `translateX(${20 * (index + 1)}px)`,
                'transition': 'transform 0.6s ease-in-out'
            });
        });

        $('.flip-box').off('click');
    });
});