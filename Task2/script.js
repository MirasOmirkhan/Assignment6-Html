const initialPartyData = [
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

let partyData = JSON.parse(JSON.stringify(initialPartyData));
let roomSortStates = {};

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
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                        <h3 style="margin:0;">${roomObj.room}</h3>
                        <button class="sort-room-btn" style="font-size:10px; padding:2px 6px;">Sort by time</button>
                    </div>
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

    if ($('#clear-btn').length === 0) {
        $('#controls').append('<div class="actions" style="margin-top:10px;"><button id="clear-btn" style="background:#3498db; color:white; border:none; padding:6px 12px; border-radius:5px; cursor:pointer;">Clear Spotlight</button></div>');
    }

    $(document).on('click', '#clear-btn', function() {
        $('.guest-card, .room').removeClass('highlighted').stop(true, true).fadeTo(300, 1.0);
        $('#case-result-info').text('');
    });

    $(document).on('click', '.guest-card', function(e) {
        if ($(e.target).closest('.guest-card-popup').length) return;
        $('.guest-card-popup').remove();

        const $card = $(this);
        const name = $card.attr('data-name');
        const time = $card.attr('data-time');
        const isAitu = $card.attr('data-aitu') === 'true';
        const rawItems = $card.attr('data-items');
        const items = rawItems ? rawItems.split(',') : [];

        let itemsText = items.length > 0 ? `Has a ${items.join(' and a ')}` : "Has nothing at all";
        let aituText = isAitu ? "AITU student" : "Not an AITU student";

        const $popup = $(`
            <div class="guest-card-popup" style="display:none;">
                <h4>${name}</h4>
                <p>Came at ${time}</p>
                <p>${aituText}</p>
                <p>${itemsText}</p>
                <div class="move-buttons">
                    <button class="move-to-room" data-guest="${name}" data-target="Balcony">Balcony</button>
                    <button class="move-to-room" data-guest="${name}" data-target="Hall">Hall</button>
                    <button class="move-to-room" data-guest="${name}" data-target="Kitchen">Kitchen</button>
                    <button class="move-to-room" data-guest="${name}" data-target="Living room">Living room</button>
                </div>
                <button class="close-popup">Close</button>
            </div>
        `);

        $('body').append($popup);
        $popup.fadeIn(200);
    });

    $(document).on('click', '.close-popup', function() { closePopup(); });
    $(document).on('keydown', function(e) { if (e.key === 'Escape') closePopup(); });
    $(document).on('click', function(e) {
        if (!$(e.target).closest('.guest-card, .guest-card-popup').length) closePopup();
    });

    $(document).on('click', '.move-to-room', function() {
        const guestName = $(this).data('guest');
        const targetRoomName = $(this).data('target');
        closePopup();

        let movedGuestObj = null;
        partyData.forEach(r => {
            const index = r.guests.findIndex(g => g.name === guestName);
            if (index !== -1) movedGuestObj = r.guests.splice(index, 1)[0];
        });

        const targetRoomObj = partyData.find(r => r.room === targetRoomName);
        if (targetRoomObj && movedGuestObj) targetRoomObj.guests.push(movedGuestObj);

        const $card = $(`.guest-card[data-name="${guestName}"]`);
        const $targetRoomList = $(`.room[data-room="${targetRoomName}"] .guests-list`);
        const startOffset = $card.offset();

        const $clone = $card.clone().appendTo('body').css({
            position: 'absolute', top: startOffset.top, left: startOffset.left, zIndex: 9999, margin: 0
        });

        $card.stop(true, true).animate({ width: 0, opacity: 0 }, 300, function() { $(this).remove(); });

        const targetOffset = $targetRoomList.offset();
        const guestCount = $targetRoomList.children().length;

        $clone.stop(true, true).animate({
            top: targetOffset.top, left: targetOffset.left + (guestCount * 65)
        }, 600, function() {
            $clone.remove();
            renderParty();
        });
    });

    $(document).on('click', '.sort-room-btn', function() {
        const roomName = $(this).closest('.room').data('room');
        const roomObj = partyData.find(r => r.room === roomName);

        if (!roomSortStates[roomName]) {
            roomObj.guests.sort((a, b) => a.time.localeCompare(b.time));
            roomSortStates[roomName] = true;
        } else {
            const origRoom = initialPartyData.find(r => r.room === roomName);
            roomObj.guests.sort((a, b) => origRoom.guests.findIndex(g => g.name === a.name) - origRoom.guests.findIndex(g => g.name === b.name));
            roomSortStates[roomName] = false;
        }
        renderParty();
    });
});

function closePopup() {
    $('.guest-card-popup').stop(true, true).fadeOut(200, function() { $(this).remove(); });
}

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

    if ($target.hasClass('room')) {
        $('.room').not($target).find('.guest-card').stop(true, true).fadeTo(300, 0.2);
        $target.find('.guest-card').stop(true, true).fadeTo(300, 1.0);
    } else {
        $('.guest-card').not($target).stop(true, true).fadeTo(300, 0.2);
        $target.stop(true, true).fadeTo(300, 1.0);
    }

    if ($target.length > 0 && !$target.hasClass('room')) {
        $target.stop(true, true).animate({ top: "-=10px" }, 150).animate({ top: "+=10px" }, 150);
    }

    const foundNames = $target.map(function() {
        return $(this).attr('data-name') || $(this).attr('data-room') || '';
    }).get().join(', ');

    $('#case-result-info').text(`Case ${caseNumber} result (${$target.length}): ${foundNames}`);
}