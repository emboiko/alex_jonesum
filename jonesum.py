from random import randint, shuffle


class Alex_Jones:
    def __init__(self):
        with open("isms.txt") as in_file:
            self.isms = in_file.read().splitlines()
            shuffle(self.isms)


    def pontificate(self, sep=" ", end="."):
        isms = self.isms
        pontifications = []

        count = randint(4,8)
        for i in range(count):
            pontifications.append(isms.pop())

        if randint(1,2) > 1:
            punctuation_index = randint(0, count-3)
            pontifications[punctuation_index] = pontifications[punctuation_index] + ","

        pontifications[0] = pontifications[0][0].upper() + pontifications[0][1:]

        return sep.join(pontifications) + end


    def rant(self, count=None):
        heavy_knowledge = []

        if not count:
            count = randint(4,8)

        angry_index = randint(0,count-1)

        for i in range(count):
            if (i == angry_index) and randint(1,4) > 3:
                heavy_knowledge.append(self.pontificate().upper().replace(".","!"))
            else:
                heavy_knowledge.append(self.pontificate())

        return " ".join(heavy_knowledge)


def main():
    alex_jones = Alex_Jones()
    print(alex_jones.rant())


if __name__ == "__main__":
    main()
