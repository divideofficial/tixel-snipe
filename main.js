const axios = require("axios");
const cheerio = require("cheerio");
const { Webhook, MessageBuilder } = require("discord-webhook-node");
const hook = new Webhook(
	"https://discord.com/api/webhooks/1086283928823922708/6If2II4PQ9prJRZCcr4uBmhwQbYwVkoE3tZZdzuHs20YsvuY6b1g-gVSQJy0OicK8lAG"
);

hook.setUsername("Tixel Bot");

const tixel_url =
	"https://tixel.com/au/music-tickets/2023/04/15/ultra-australia-2023/general-admission";

// sleep time expects milliseconds
function sleep(time) {
	return new Promise((resolve) => setTimeout(resolve, time));
}

function get_prices() {
	return new Promise((resolve) => {
		axios
			.get(tixel_url)
			.then((response) => {
				// lets not get blocked from site 10 second sleep
				sleep(2500).then(() => {
					const $ = cheerio.load(response.data);
					prices = [];

					// loop all spans
					$("span").each((i, elem) => {
						if (elem.prev && elem.prev.data && elem.prev.data.includes("$")) {
							var price = elem.prev.data;
							price = price.replace("$", "");

							prices.push(Number(price));
						}
					});
					resolve(prices);
				});
			})
			.catch((error) => {
				console.error(error);
			});
	});
}

async function scrape_actual() {
	const prices = await get_prices();
	console.log(prices);

	var minimum_price = Math.min(...prices);
	console.log(minimum_price);
	var embed = new MessageBuilder()
		.setTitle(`Prices found`)
		.setDescription(`Cheapest price found: ${minimum_price}`)

		.setTimestamp();

	if (minimum_price <= 160) hook.send(embed);

	scrape_actual();
}

const embed = new MessageBuilder()
	.setTitle(`Started bot`)
	.setDescription(`The bot has been started. Begin checking.`)
	.setTimestamp();

function scrape() {
	console.log("Started");

	hook.send(embed);

	scrape_actual();
}

scrape();
