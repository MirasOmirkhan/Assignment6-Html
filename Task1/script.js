const partyData = [
    {
        floor: "Floor 2",
        room: "Balcony",
        guests: [
            { name: "Aigerim", color: "blue", time: "20:45", isAitu: true, items: ["phone", "cup", "crumbs"] },
            { name: "Aliya", color: "yellow", time: "21:15", isAitu: true, items: ["phone", "bag"] },
            { name: "Madina", color: "purple", time: "22:10", isAitu: false, items: ["phone", "bag"] },
            { name: "Ivan", color: "blue", time: "20:10", isAitu: true, items: ["phone"] }
        ]
    },
    {
        floor: "Floor 2",
        room: "Hall",
        guests: [
            { name: "Arman", color: "orange", time: "20:35", isAitu: true, items: ["bag", "glasses"] },
            { name: "Sophia", color: "purple", time: "21:20", isAitu: false, items: ["phone"] },
            { name: "Dias", color: "blue", time: "19:45", isAitu: true, items: ["phone", "bag", "cup"] },
            { name: "Bekzat", color: "purple", time: "20:55", isAitu: true, items: ["bag", "cup"] },
            { name: "Aruzhan", color: "blue", time: "21:50", isAitu: false, items: ["phone"] },
            { name: "Saule", color: "orange", time: "21:25", isAitu: false, items: ["glasses"] }
        ]
    },
    {
        floor: "Floor 1",
        room: "Kitchen",
        guests: [
            { name: "Nurlan", color: "red", time: "19:40", isAitu: true, items: ["phone", "bag"] },
            { name: "Emma", color: "orange", time: "20:15", isAitu: false, items: ["phone", "bag", "cup"] },
            { name: "Timur", color: "green", time: "21:05", isAitu: true, items: ["phone", "bag", "crumbs"] },
            { name: "Sergey", color: "yellow", time: "20:50", isAitu: true, items: ["glasses"] },
            { name: "Yertan", color: "red", time: "21:40", isAitu: true, items: ["glasses"] },
            { name: "Kamila", color: "purple", time: "20:05", isAitu: false, items: [] }
        ]
    },
    {
        floor: "Floor 1",
        room: "Living room",
        guests: [
            { name: "Daniel", color: "blue", time: "19:55", isAitu: true, items: ["glasses"] },
            { name: "Zarina", color: "green", time: "22:30", isAitu: false, items: [] },
            { name: "Natasha", color: "blue", time: "20:30", isAitu: true, items: [] },
            { name: "Askar", color: "red", time: "21:00", isAitu: true, items: ["bag"] },
            { name: "Inkar", color: "purple", time: "20:20", isAitu: true, items: ["bag"] }
        ]
    }
];

function renderParty() {
    const $house = $('#house-container').empty();
    const floors = ["Floor 2", "Floor 1"];

    floors.forEach(floorName => {
        const $floorDiv = $(`
            <div class="floor" data-floor="${floorName}">
                <div class="floor-label">${floorName}</div>
                <div class="floor-rooms"></div>
            </div>
        `);

        partyData.filter(r => r.floor === floorName).forEach(roomObj => {
            const $roomDiv = $(`
                <div class="room" data-room="${roomObj.room}">
                    <h3>${roomObj.room}</h3>
                    <div class="guests-list"></div>
                </div>
            `);

            roomObj.guests.forEach(g => {
                const avatarUrl = `https://api.dicebear.com/9.x/open-peeps/svg?seed=${g.name}`;
                const itemsClasses = g.items.map(i => `has-${i}`).join(' ');
                const itemsAttr = g.items.join(',');

                const itemIconsMap = { phone: '📱', glasses: '👓', bag: '👜', cup: '🥤', crumbs: '🍰' };
                const iconsHtml = g.items.map(i => itemIconsMap[i] || '').join('');

                const $guestCard = $(`
                    <div class="guest-card ${g.color}-ring ${itemsClasses}" 
                         data-name="${g.name}" 
                         data-color="${g.color}" 
                         data-time="${g.time}" 
                         data-aitu="${g.isAitu}" 
                         data-items="${itemsAttr}">
                        <div class="avatar-wrapper">
                            <img src="${avatarUrl}" alt="${g.name}">
                            ${g.isAitu ? '<span class="aitu-badge" title="AITU student">🎓</span>' : ''}
                        </div>
                        <span class="guest-name">${g.name}</span>
                        <span class="guest-time">${g.time}</span>
                        <div class="guest-icons">${iconsHtml}</div>
                    </div>
                `);

                $roomDiv.find('.guests-list').append($guestCard);
            });

            $floorDiv.find('.floor-rooms').append($roomDiv);
        });

        $house.append($floorDiv);
    });
}

$(document).ready(function() {
    renderParty();

    $(document).on('click', '.case-btn', function() {
        const caseNum = parseInt($(this).data('case'));
        executeCase(caseNum);
    });
});

function executeCase(caseNumber) {
    renderParty();
    $('.guest-card, .room').removeClass('highlighted');
    let $target = $();

    switch(caseNumber) {
        case 1: $target = $('.room[data-room="Hall"] .guest-card'); break;
        case 2: $target = $('.guest-card[data-color="yellow"], .guest-card[data-color="purple"]'); break;
        case 3: $target = $('.floor[data-floor="Floor 2"] .guest-card[data-aitu="true"]'); break;
        case 4: $target = $('.guest-card.has-glasses, .guest-card.has-bag'); break;
        case 5: $target = $('.guest-card').filter(function() { return $(this).attr('data-items') === ""; }); break;
        case 6: $target = $('.guest-card.has-phone').not('.has-bag'); break;
        case 7: $target = $('.guest-card').filter(function() { const t = $(this).attr('data-time'); return t >= "20:30" && t <= "21:00"; }); break;
        case 8: $target = $('.guest-card').filter(function() { return $(this).attr('data-time') > "21:00" && $(this).attr('data-aitu') === "false"; }); break;
        case 9: $target = $('.guest-card[data-name="Askar"]').prev().add($('.guest-card[data-name="Askar"]').next()); break;
        case 10: $target = $('.room .guests-list .guest-card:last-child'); break;
        case 11: $target = $('.room .guests-list .guest-card:nth-child(3)'); break;
        case 12: $target = $('.guest-card[data-name="Timur"]').nextAll(); break;
        case 13: $target = $('.guest-card').filter(function() { return $(this).next().attr('data-color') === 'purple'; }); break;
        case 14: $target = $('.guest-card[data-name="Aruzhan"]').closest('.room'); break;
        case 15: $target = $('.room').filter(function() { return $(this).find('.guest-card').length < 6; }); break;
        case 16: $target = $('.room').filter(function() { return $(this).find('.guest-card.has-cup').length > 0 && $(this).find('.guest-card.has-glasses').length === 0; }); break;
        case 17: $target = $('.room .guests-list .guest-card:first-child'); break;
        case 18:
            const $askar = $('.guest-card[data-name="Askar"]');
            const $miras = $(`
                <div class="guest-card blue-ring has-phone" data-name="Miras" data-color="blue" data-time="21:20" data-aitu="true" data-items="phone" style="display:none;">
                    <div class="avatar-wrapper"><img src="https://api.dicebear.com/9.x/open-peeps/svg?seed=Miras" alt="Miras"><span class="aitu-badge">🎓</span></div>
                    <span class="guest-name">Miras</span><span class="guest-time">21:20</span>
                    <div class="guest-icons">📱</div>
                </div>
            `);
            $miras.insertAfter($askar).fadeIn(800);
            $target = $miras;
            break;
        case 19:
            const $zarina = $('.guest-card[data-name="Zarina"]');
            $zarina.fadeOut(800, function() { $(this).remove(); });
            $target = $();
            break;
        case 20:
            $target = $('.floor[data-floor="Floor 1"] .guest-card').filter(function() {
                const time = $(this).attr('data-time');
                const hasCrumbs = $(this).hasClass('has-crumbs');
                const hasCup = $(this).hasClass('has-cup');
                const prevAitu = $(this).prev().attr('data-aitu') === 'true';
                const nextAitu = $(this).next().attr('data-aitu') === 'true';
                return time > "21:00" && time < "21:30" && hasCrumbs && !hasCup && (prevAitu || nextAitu);
            });
            break;
    }

    $target.addClass('highlighted');
    if ($target.length > 0 && !$target.hasClass('room')) {
        $target.stop(true, true).animate({ top: "-=10px" }, 150).animate({ top: "+=10px" }, 150);
    }

    const foundNames = $target.map(function() {
        return $(this).attr('data-name') || $(this).attr('data-room') || '';
    }).get().join(', ');

    $('#case-result-info').text(`Case ${caseNumber} result (${$target.length}): ${foundNames}`);
}