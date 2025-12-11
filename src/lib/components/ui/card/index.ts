import Content, { type CardContentProps } from './card-content.svelte';
import Description, { type CardDescriptionProps } from './card-description.svelte';
import Footer, { type CardFooterProps } from './card-footer.svelte';
import Header, { type CardHeaderProps } from './card-header.svelte';
import Root, { type CardProps } from './card.svelte';
import Title, { type CardTitleProps } from './card-title.svelte';

export {
	Root,
	Content,
	Description,
	Footer,
	Header,
	Title,
	//
	Root as Card,
	Content as CardContent,
	Description as CardDescription,
	Footer as CardFooter,
	Header as CardHeader,
	Title as CardTitle,
	type CardContentProps,
	type CardDescriptionProps,
	type CardFooterProps,
	type CardHeaderProps,
	type CardProps,
	type CardTitleProps
};
